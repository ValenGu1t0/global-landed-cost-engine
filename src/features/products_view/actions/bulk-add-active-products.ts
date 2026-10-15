'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { bulkAddActiveProductsSchema } from './bulk-add-active-products-schema';
import db from '@/db';
import { productTable, productHistoricCostsTable } from '@/db/schema';
import * as XLSX from 'xlsx';
import { revalidatePath } from 'next/cache';
import { ProductInput } from '../lib/product-factory';
import { REQUIRED_FIELDS } from '@/lib/validations/product-required';
import { inArray, InferInsertModel } from 'drizzle-orm';
import { validateProduct } from '../lib/product-validations';
import {
  validateExcelRowCount,
  checkAndConsumeDemoQuota
} from '@/lib/demo-guardrails';

const COST_MAP = {
  fob: { incoterm: 'FOB', commentary: 'fob_commentary' },
  exw: { incoterm: 'EXW', commentary: 'exw_commentary' },
  cnf: { incoterm: 'CNF', commentary: 'cnf_commentary' },
  ddp: { incoterm: 'DDP', commentary: 'ddp_commentary' },
  cnf_diff: { incoterm: 'CNF_DIFF', commentary: 'cnf_diff_commentary' }
} as const;

function isPresent(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return !Number.isNaN(value);
  return true;
}

export const bulkAddActiveProducts = authActionClient
  .metadata({ actionName: 'bulkAddActiveProducts' })
  .inputSchema(bulkAddActiveProductsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const file = Array.isArray(parsedInput.excel)
      ? parsedInput.excel[0]
      : parsedInput.excel;

    if (!file) throw new Error('No excel file was received.');

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data: ProductInput[] = XLSX.utils.sheet_to_json(worksheet);

    /* --------------------- DEMO GUARDRAILS --------------------- */
    const rowGuard = validateExcelRowCount(data, 'products');
    if (rowGuard) {
      return rowGuard;
    }

    const quotaCheck = await checkAndConsumeDemoQuota(
      ctx?.session?.user?.id,
      data.length,
      'product_create'
    );
    if (!quotaCheck.allowed) {
      return {
        success: false,
        message: quotaCheck.message || 'Daily demo quota reached.',
        errors: [
          quotaCheck.message || 'Daily quota limit reached.',
          'In this portfolio demo, operations are limited to 10 products per user per day.'
        ]
      };
    }

    const rows = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });
    const headerRow = rows[0].map((h) => String(h).trim());
    const requiredColumns = REQUIRED_FIELDS.ACTIVE;

    /* --------------------- VALIDACIÓN HEADERS --------------------- */
    const missingColumns = requiredColumns.filter(
      (col) => !headerRow.includes(col)
    );

    if (missingColumns.length > 0) {
      return {
        success: false,
        message: 'Missing required columns.',
        errors: [
          `The following columns are missing: ${missingColumns.join(', ')}`
        ]
      };
    }

    /* --------------------- VALIDACIONES --------------------- */
    let allErrors: string[] = [];

    const hemicodesFromFile = data
      .map((product) => (product as any).hemicode)
      .filter((h): h is string => typeof h === 'string' && h.trim() !== '');

    if (hemicodesFromFile.length === 0) {
      allErrors.push("Couldn't find any valid hemicodes.");
    }

    const uniqueHemicodes = new Set<string>();
    const duplicateHemicodes: string[] = [];

    for (const code of hemicodesFromFile) {
      if (uniqueHemicodes.has(code)) {
        if (!duplicateHemicodes.includes(code)) {
          duplicateHemicodes.push(code);
        }
      } else {
        uniqueHemicodes.add(code);
      }
    }

    if (duplicateHemicodes.length > 0) {
      allErrors.push(
        `The following hemicodes are repeated inside the file: ${duplicateHemicodes.join(', ')}`
      );
    }

    if (uniqueHemicodes.size > 0) {
      const existingProducts = await db
        .select({ hemicode: productTable.hemicode })
        .from(productTable)
        .where(inArray(productTable.hemicode, Array.from(uniqueHemicodes)));

      if (existingProducts.length > 0) {
        const existingHemicodes = existingProducts.map((p) => p.hemicode);
        allErrors.push(
          `The following hemicodes already exist in the database: ${existingHemicodes.join(', ')}`
        );
      }
    }

    data.forEach((product, index) => {
      const rowErrors = validateProduct(product, index);
      if (rowErrors.length > 0) allErrors.push(...rowErrors);
    });

    /* INCOTERMS + STATUS + COMMENTARY */
    data.forEach((product, index) => {
      const row = index + 2;
      const msg = (m: string) => `[Row ${row}] ${m}`;

      const statusVal = (product as any).status;
      if (String(statusVal).trim().toUpperCase() !== 'ACTIVE') {
        allErrors.push(
          msg(`The field STATUS must be 'ACTIVE'. Received: '${statusVal}'.`)
        );
      }

      const incotermValues = [
        (product as any).fob,
        (product as any).exw,
        (product as any).cnf,
        (product as any).ddp,
        (product as any).cnf_diff
      ];

      const hasAtLeastOneIncoterm = incotermValues.some((v) => isPresent(v));

      if (!hasAtLeastOneIncoterm) {
        allErrors.push(
          msg(
            `At least one incoterm (fob, exw, cnf, ddp, cnf_diff) must have a value.`
          )
        );
      }

      const costUpdateCommentary = (product as any).cost_update_commentary;
      if (hasAtLeastOneIncoterm && !isPresent(costUpdateCommentary)) {
        allErrors.push(
          msg(
            `cost_update_commentary is required when an incoterm is provided.`
          )
        );
      }
    });

    if (allErrors.length > 0) {
      return {
        success: false,
        message: 'Errors found in the Excel file.',
        errors: allErrors
      };
    }

    /* --------------------- CONSTRUCCIÓN DE INSERTS --------------------- */
    const now = new Date();
    const endOfTimes = new Date('2100-01-01T00:00:00.000Z');

    const productsToInsert: Array<InferInsertModel<typeof productTable>> = [];

    const COMMENTARY_KEYS = [
      'cost_update_commentary',
      'fob_commentary',
      'exw_commentary',
      'cnf_commentary',
      'ddp_commentary',
      'cnf_diff_commentary'
    ];

    for (const product of data) {
      const cleanProduct: Record<string, any> = { ...(product as any) };

      for (const k of COMMENTARY_KEYS) {
        if (k in cleanProduct) delete cleanProduct[k];
      }

      productsToInsert.push(
        cleanProduct as InferInsertModel<typeof productTable>
      );
    }

    /* ------------------ TRANSACCIÓN ------------------ */
    await db.transaction(async (tx) => {
      const insertedProducts = await tx
        .insert(productTable)
        .values(productsToInsert)
        .returning();

      const techIdByHemicode = new Map(
        insertedProducts.map((p) => [p.hemicode, p.tech_sku_id])
      );

      const historicCostsToInsert: Array<
        InferInsertModel<typeof productHistoricCostsTable>
      > = [];

      for (const product of data) {
        const techId = techIdByHemicode.get((product as any).hemicode);
        if (!techId) continue;

        for (const key of Object.keys(COST_MAP) as Array<
          keyof typeof COST_MAP
        >) {
          const costValue = (product as any)[key];
          if (isPresent(costValue)) {
            const { incoterm } = COST_MAP[key];

            historicCostsToInsert.push({
              tech_sku_id: techId,
              start_date: now,
              end_date: endOfTimes,
              cost: Number(costValue),
              cost_update_commentary:
                (product as any).cost_update_commentary ?? 'Without Commentary',
              import_incoterm: incoterm
            });
          }
        }
      }

      if (historicCostsToInsert.length > 0) {
        await tx
          .insert(productHistoricCostsTable)
          .values(historicCostsToInsert);
      }
    });

    // These are the scripts that perform product calculations that are directly related to the Product Table.
    import('@/lib/db/run-sql-file').then(async ({ runSqlFile }) => {
      try {
        await runSqlFile(
          'src/sql/Truncated Scripts/3_current_incoterm_value_truncate.sql'
        );
        await runSqlFile('src/sql/Truncated Scripts/4_hts_truncate.sql');
        await runSqlFile('src/sql/Truncated Scripts/6_tariffs_truncate.sql');
        await runSqlFile(
          'src/sql/Truncated Scripts/7_duties_calculations_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/8_tariff_calculations_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/9_carton_dims_calculations_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/10_optimal_cartons_per_pallet_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/11_40HC_calculations_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/12_45HC_calculations_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/13_40STD_calculations_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/14_20STD_calculations_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/15_53FT_calculations_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/17_ground_logistic_per_container_calculations_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/18_ocean_logistic_per_container_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/19_final_logistic_costs_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/20_final_landed_costs_calculations_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/21_kits_calculations_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/22_comission_calculations_truncate.sql'
        );
        await runSqlFile('src/sql/postgress_public/2_products_postgres.sql');
        await runSqlFile('src/sql/postgress_public/3_kits_postgres.sql');
      } catch (err) {
        throw new Error('SQL execution failed');
      }
    });

    revalidatePath('/dashboard/products_view');

    return {
      success: true,
      message: `${productsToInsert.length} products added successfully!`,
      errors: []
    };
  });
