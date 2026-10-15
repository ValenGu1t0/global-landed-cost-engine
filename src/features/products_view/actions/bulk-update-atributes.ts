'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { bulkUpdateAtributesSchema } from './bulk-update-atributes-schema';
import db from '@/db';
import { ProductTable } from '@/db/schema';
import { productTable, productHistoricCostsTable } from '@/db/schema';
import * as XLSX from 'xlsx';
import { revalidatePath } from 'next/cache';
import { ProductInput } from '../lib/product-factory';
import { and, eq, inArray, InferInsertModel } from 'drizzle-orm';
import { validateProductUpdate } from '../lib/product-validations';
import { validateExcelRowCount } from '@/lib/demo-guardrails';

// Definición de las claves de Incoterms para la lógica de costos
const COST_KEYS = ['fob', 'exw', 'cnf', 'ddp', 'cnf_diff'] as const;
type CostKey = (typeof COST_KEYS)[number];

const COST_MAP = {
  fob: { incoterm: 'FOB', commentary: 'fob_commentary' },
  exw: { incoterm: 'EXW', commentary: 'exw_commentary' },
  cnf: { incoterm: 'CNF', commentary: 'cnf_commentary' },
  ddp: { incoterm: 'DDP', commentary: 'ddp_commentary' },
  cnf_diff: { incoterm: 'CNF_DIFF', commentary: 'cnf_diff_commentary' }
} as const;

// Helper para verificar si un valor está presente (no nulo, no vacío)
function isPresent(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return !Number.isNaN(value);
  return true;
}

export const bulkUpdateAtributes = authActionClient
  .metadata({ actionName: 'bulkUpdateProducts' })
  .inputSchema(bulkUpdateAtributesSchema)
  .action(async ({ parsedInput }) => {
    const file = Array.isArray(parsedInput.excel)
      ? parsedInput.excel[0]
      : parsedInput.excel;

    if (!file) throw new Error('No excel file was received.');

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Se usa ProductInput solo para tipado del parseo, pero la estructura real es dinámica.
    const data: ProductInput[] = XLSX.utils.sheet_to_json(worksheet, {
      raw: false, // Mantener valores como strings si es necesario
      defval: null // Las celdas vacías son NULL, que se interpretará como NULL / '' en DB
    });

    /* --------------------- DEMO GUARDRAILS --------------------- */
    const rowGuard = validateExcelRowCount(data, 'attributes');
    if (rowGuard) {
      return rowGuard;
    }

    const rows = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });
    const headerRow = rows[0].map((h) => String(h).trim());

    let allErrors: string[] = [];
    const EXCLUDED_COLUMNS = ['tech_sku_id', 'image', 'status'];
    const REQUIRED_UPDATE_COLUMNS = ['hemicode'];

    /* --------------------- VALIDACIÓN HEADERS Y FORMATO --------------------- */

    // Columnas prohibidas (tech_sku_id, image, status)
    const forbiddenColumns = headerRow.filter((col) =>
      EXCLUDED_COLUMNS.includes(col.toLowerCase())
    );
    if (forbiddenColumns.length > 0) {
      allErrors.push(
        `The following columns are forbidden in the update: ${forbiddenColumns.join(', ')}`
      );
    }

    // Columna 'hemicode' DEBE estar presente.
    if (!headerRow.includes('hemicode')) {
      allErrors.push(`The column 'hemicode' is required for the update.`);
    }

    // Si hay errores de headers, detener antes de procesar data.
    if (allErrors.length > 0) {
      return {
        success: false,
        message: 'Errors found in the Excel file headers.',
        errors: allErrors
      };
    }

    /* --------------------- VALIDACIONES DE DATOS (Filas) --------------------- */

    const hemicodesFromFile = data
      .map((product) => (product as any).hemicode)
      .filter((h): h is string => typeof h === 'string' && h.trim() !== '');

    // Columna 'hemicode' debe estar completa (no null/vacía)
    if (hemicodesFromFile.length !== data.length) {
      const emptyHemicodeRows = data.reduce((acc, product, index) => {
        const hemicode = (product as any).hemicode;
        if (!isPresent(hemicode)) {
          acc.push(index + 2);
        }
        return acc;
      }, [] as number[]);

      if (emptyHemicodeRows.length > 0) {
        allErrors.push(
          `The 'hemicode' is required and cannot be empty in rows: ${emptyHemicodeRows.join(', ')}`
        );
      }
    }

    // No puede haber hemicodes duplicados adentro del Excel.
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

    if (allErrors.length > 0) {
      return {
        success: false,
        message: 'Errors found in the Excel file.',
        errors: allErrors
      };
    }

    // Todos los hemicodes presentes en el Excel deben existir en la DB.
    let existingProductsMap: Map<
      string,
      Pick<ProductTable, 'tech_sku_id' | 'status'>
    > = new Map();
    const hemicodesArray = Array.from(uniqueHemicodes);

    if (hemicodesArray.length > 0) {
      const existingProducts = await db
        .select({
          hemicode: productTable.hemicode,
          tech_sku_id: productTable.tech_sku_id,
          status: productTable.status
        })
        .from(productTable)
        .where(inArray(productTable.hemicode, hemicodesArray));

      const existingHemicodes = existingProducts.map((p) => p.hemicode);
      const nonExistingHemicodes = hemicodesArray.filter(
        (h) => !existingHemicodes.includes(h)
      );

      if (nonExistingHemicodes.length > 0) {
        allErrors.push(
          `The following hemicodes do not exist in the database: ${nonExistingHemicodes.join(', ')}`
        );
      }

      existingProducts.forEach((p) => {
        existingProductsMap.set(p.hemicode!, {
          tech_sku_id: p.tech_sku_id,
          status: p.status
        });
      });
    }

    if (allErrors.length > 0) {
      return {
        success: false,
        message: 'Errors found in the Excel file.',
        errors: allErrors
      };
    }

    /* --------------------- VALIDACIONES POR FILA (REGLAS DE NEGOCIO) --------------------- */

    data.forEach((product, index) => {
      const row = index + 2; // Fila de Excel
      const msg = (m: string) => `[Row ${row}] ${m}`;
      const hemicode = (product as any).hemicode;

      // Obtener el status de la DB para la validación de campos obligatorios
      const dbProduct = existingProductsMap.get(hemicode);
      const currentStatus = dbProduct?.status ?? 'UNKNOWN'; // Usar un default seguro

      // Validaciones de campos obligatorios basadas en el status actual de la DB
      const requiredErrors = validateProductUpdate(
        product,
        index,
        currentStatus,
        headerRow
      );
      if (requiredErrors.length > 0) allErrors.push(...requiredErrors);

      // Incoterms y comentario de costo
      const incotermColumnsInFile = COST_KEYS.filter((key) =>
        headerRow.includes(key)
      );
      const isUpdatingAnyIncoterm = incotermColumnsInFile.length > 0;

      const costUpdateCommentary = (product as any).cost_update_commentary;

      // 1. Incoterms + Commentary OBLIGATORIO (Validación de Comentario)
      if (isUpdatingAnyIncoterm) {
        const costCommentaryInFile = headerRow.includes(
          'cost_update_commentary'
        );

        if (costCommentaryInFile && !isPresent(costUpdateCommentary)) {
          allErrors.push(
            msg(
              `The column 'cost_update_commentary' is required and cannot be empty when incoterm columns are provided.`
            )
          );
        } else if (!costCommentaryInFile) {
          allErrors.push(
            msg(
              `The column 'cost_update_commentary' is required and must be present in the file when incoterm columns are provided.`
            )
          );
        }
      }

      // Mínimo un Incoterm con valor para ACTIVE/PROJECT (Validación de Valor)
      const isProductActiveOrProject =
        currentStatus.toUpperCase() === 'ACTIVE' ||
        currentStatus.toUpperCase() === 'PROJECT' ||
        currentStatus.toUpperCase() === 'GS';

      if (isUpdatingAnyIncoterm && isProductActiveOrProject) {
        const hasValueInFile = incotermColumnsInFile.some((key) => {
          // Buscamos si el valor está presente (no null/vacío) en la fila del Excel.
          return isPresent((product as any)[key]);
        });

        if (!hasValueInFile) {
          allErrors.push(
            msg(
              `For status '${currentStatus}', at least one incoterm (fob, exw, cnf, ddp, cnf_diff) must have a value when incoterm columns are provided.`
            )
          );
        }
      }
    });

    if (allErrors.length > 0) {
      return {
        success: false,
        message: 'Errors found in the Excel file.',
        errors: allErrors
      };
    }

    /* --------------------- CONSTRUCCIÓN DE UPDATES --------------------- */

    const now = new Date();
    const endOfTimes = new Date('2100-01-01T00:00:00.000Z');

    // Objeto para almacenar los updates de productos
    const productsToUpdate: {
      hemicode: string;
      data: Partial<ProductTable>;
    }[] = [];

    // Lista de Incoterms que se actualizaron y necesitan registro histórico
    const historicCostsToProcess: {
      tech_sku_id: number;
      incoterm: CostKey;
      costValue: number | null;
      commentary: string;
    }[] = [];

    const COMMENTARY_KEYS = [
      'cost_update_commentary',
      'fob_commentary',
      'exw_commentary',
      'cnf_commentary',
      'ddp_commentary',
      'cnf_diff_commentary'
    ];

    const columnsToUpdate = headerRow.filter(
      (col) =>
        !REQUIRED_UPDATE_COLUMNS.includes(col.toLowerCase()) &&
        !COMMENTARY_KEYS.includes(col.toLowerCase())
    );

    for (const productRow of data) {
      const hemicode = (productRow as any).hemicode;
      const dbProduct = existingProductsMap.get(hemicode)!; // Ya validado que existe
      const techId = dbProduct.tech_sku_id;

      const updateData: Partial<ProductTable> = {};

      // image_in_process (Null/Vacío -> False)
      if (headerRow.includes('image_in_process')) {
        const rawValue = (productRow as any).image_in_process;

        // Si el valor está vacío (null/undefined/string vacío), lo forzamos a FALSE.
        if (!isPresent(rawValue)) {
          updateData.image_in_process = false;
        } else {
          // Si hay un valor, lo convertimos a booleano canónico
          // Esto maneja 'true'/'false' (string), 1, 0, etc.
          const normalizedValue =
            String(rawValue).toLowerCase() === 'true' || rawValue === 1;
          updateData.image_in_process = normalizedValue;
        }
      }

      // Construir el objeto de actualización con solo las columnas presentes
      for (const col of columnsToUpdate) {
        // Aseguramos no sobreescribir si ya lo manejamos arriba
        if (col === 'image_in_process') continue;

        // El valor es de la celda de Excel, que puede ser 'null' si está vacía.
        const value = (productRow as any)[col];

        // Drizzle actualizará con el valor, incluyendo null (para 'borrar' el campo).
        // Se asegura que los números se traten como números (aunque XLSX.utils.sheet_to_json ya debería ayudar).
        updateData[col as keyof ProductTable] =
          typeof value === 'number' ? value : value;
      }

      if (Object.keys(updateData).length > 0) {
        productsToUpdate.push({ hemicode, data: updateData });
      }

      // Procesar costos para historial
      const costUpdateCommentary =
        (productRow as any).cost_update_commentary ?? 'Without Commentary';

      for (const key of COST_KEYS) {
        if (headerRow.includes(key) && (productRow as any)[key] !== undefined) {
          const costValue = (productRow as any)[key];

          // Solo procesar si el valor no es null (no se registra historial para 'borrar' un costo)
          if (isPresent(costValue)) {
            historicCostsToProcess.push({
              tech_sku_id: techId,
              incoterm: key,
              costValue: Number(costValue),
              commentary: costUpdateCommentary
            });
          }
        }
      }
    }

    /* ------------------ TRANSACCIÓN ------------------ */

    await db.transaction(async (tx) => {
      // Actualizar productos
      for (const update of productsToUpdate) {
        await tx
          .update(productTable)
          .set(update.data)
          .where(eq(productTable.hemicode, update.hemicode));
      }

      // Procesar historial de costos
      const newHistoricCosts: Array<
        InferInsertModel<typeof productHistoricCostsTable>
      > = [];

      for (const cost of historicCostsToProcess) {
        const { tech_sku_id, incoterm, costValue, commentary } = cost;
        const dbIncoterm = COST_MAP[incoterm].incoterm;

        // a) Cerrar registros activos existentes para ese producto e incoterm
        await tx
          .update(productHistoricCostsTable)
          .set({ end_date: now })
          .where(
            and(
              eq(productHistoricCostsTable.tech_sku_id, tech_sku_id),
              eq(productHistoricCostsTable.import_incoterm, dbIncoterm),
              eq(productHistoricCostsTable.end_date, endOfTimes)
            )
          );

        // b) Abrir un registro nuevo
        newHistoricCosts.push({
          tech_sku_id: tech_sku_id,
          start_date: now,
          end_date: endOfTimes,
          cost: costValue!,
          cost_update_commentary: commentary,
          import_incoterm: dbIncoterm
        });
      }

      if (newHistoricCosts.length > 0) {
        await tx.insert(productHistoricCostsTable).values(newHistoricCosts);
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
      message: `${productsToUpdate.length} products updated successfully!`,
      errors: []
    };
  });
