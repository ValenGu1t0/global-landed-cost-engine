'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import {
  bulkUpdateHemicodeSchema,
  BulkUpdateHemicodeSchema
} from './bulk-update-hemicode-schema';
import db from '@/db';
import { productTable } from '@/db/schema';
import * as XLSX from 'xlsx';
import { revalidatePath } from 'next/cache';
import { BulkHemicodeUpdateInput } from '../lib/product-factory';
import { eq, inArray } from 'drizzle-orm';
import { validateExcelRowCount } from '@/lib/demo-guardrails';

// Helper para verificar si un valor está presente (no nulo, no vacío)
function isPresent(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return !Number.isNaN(value);
  return true;
}

export const bulkUpdateHemicodes = authActionClient
  .metadata({ actionName: 'bulkUpdateHemicodes' })
  .inputSchema(bulkUpdateHemicodeSchema)
  .action(async ({ parsedInput }) => {
    const file = Array.isArray(parsedInput.excel)
      ? parsedInput.excel[0]
      : parsedInput.excel;

    if (!file) throw new Error('No excel file was received.');

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    /* --------------------- PARSEO DE EXCEL --------------------- */

    const data: BulkHemicodeUpdateInput[] = XLSX.utils.sheet_to_json(
      worksheet,
      {
        raw: false,
        defval: null
      }
    );

    /* --------------------- DEMO GUARDRAILS --------------------- */
    const rowGuard = validateExcelRowCount(data, 'SKUs');
    if (rowGuard) {
      return rowGuard;
    }

    const rows = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });
    const headerRow = rows[0].map((h) => String(h).trim().toLowerCase());

    let allErrors: string[] = [];

    /* -----------------------------------------------------------
      VALIDACIÓN DE HEADERS
    ----------------------------------------------------------- */

    if (!headerRow.includes('old_hemicode')) {
      allErrors.push("The column 'old_hemicode' is required.");
    }
    if (!headerRow.includes('new_hemicode')) {
      allErrors.push("The column 'new_hemicode' is required.");
    }

    if (allErrors.length > 0) {
      return {
        success: false,
        message: 'Errors found in Excel file headers.',
        errors: allErrors
      };
    }

    /* -----------------------------------------------------------
      VALIDACIÓN DE COMPLETITUD DE COLUMNAS
    ----------------------------------------------------------- */

    const emptyOld: number[] = [];
    const emptyNew: number[] = [];

    data.forEach((row, index) => {
      const oldCode = (row as any).old_hemicode;
      const newCode = (row as any).new_hemicode;

      if (!isPresent(oldCode)) emptyOld.push(index + 2);
      if (!isPresent(newCode)) emptyNew.push(index + 2);
    });

    if (emptyOld.length > 0) {
      allErrors.push(
        `Column 'old_hemicode' must be filled. Empty rows: ${emptyOld.join(', ')}`
      );
    }

    if (emptyNew.length > 0) {
      allErrors.push(
        `Column 'new_hemicode' must be filled. Empty rows: ${emptyNew.join(', ')}`
      );
    }

    if (allErrors.length > 0) {
      return {
        success: false,
        message: 'Errors in Excel data.',
        errors: allErrors
      };
    }

    /* -----------------------------------------------------------
      VALIDACIÓN DE DUPLICADOS DENTRO DEL EXCEL
    ----------------------------------------------------------- */

    const oldCodes = data.map((r) => (r as any).old_hemicode);
    const newCodes = data.map((r) => (r as any).new_hemicode);

    function findDuplicates(arr: string[]) {
      const seen = new Set<string>();
      const duplicates: string[] = [];
      arr.forEach((v) => {
        if (seen.has(v)) duplicates.push(v);
        else seen.add(v);
      });
      return duplicates;
    }

    const duplicatedOld = findDuplicates(oldCodes);
    const duplicatedNew = findDuplicates(newCodes);

    if (duplicatedOld.length > 0) {
      allErrors.push(
        `The following old_hemicodes are duplicated inside the Excel: ${duplicatedOld.join(', ')}`
      );
    }

    if (duplicatedNew.length > 0) {
      allErrors.push(
        `The following new_hemicodes are duplicated inside the Excel: ${duplicatedNew.join(', ')}`
      );
    }

    if (allErrors.length > 0) {
      return {
        success: false,
        message: 'Errors in duplicated values.',
        errors: allErrors
      };
    }

    /* -----------------------------------------------------------
      VALIDACIÓN CONTRA BASE DE DATOS
    ----------------------------------------------------------- */

    // 1. Todos los old_hemicodes deben existir en la DB.
    const uniqueOldCodes = Array.from(new Set(oldCodes));
    const existingOldProducts = await db
      .select({ hemicode: productTable.hemicode })
      .from(productTable)
      .where(inArray(productTable.hemicode, uniqueOldCodes));

    const existingOld = existingOldProducts.map((p) => p.hemicode);
    const missingOld = uniqueOldCodes.filter((h) => !existingOld.includes(h));

    if (missingOld.length > 0) {
      allErrors.push(
        `These old_hemicodes do not exist in the product table: ${missingOld.join(', ')}`
      );
    }

    // 2. Ningún new_hemicode puede existir actualmente en DB.
    const uniqueNewCodes = Array.from(new Set(newCodes));
    const existingNewProducts = await db
      .select({ hemicode: productTable.hemicode })
      .from(productTable)
      .where(inArray(productTable.hemicode, uniqueNewCodes));

    const existingNew = existingNewProducts.map((p) => p.hemicode);

    if (existingNew.length > 0) {
      allErrors.push(
        `These new_hemicodes already exist in the product table: ${existingNew.join(', ')}`
      );
    }

    if (allErrors.length > 0) {
      return {
        success: false,
        message: 'Database validation failed.',
        errors: allErrors
      };
    }

    /* -----------------------------------------------------------
      UPDATE MASIVO
    ----------------------------------------------------------- */

    await db.transaction(async (tx) => {
      for (const row of data) {
        await tx
          .update(productTable)
          .set({ hemicode: (row as any).new_hemicode })
          .where(eq(productTable.hemicode, (row as any).old_hemicode));
      }
    });

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

    revalidatePath('/dashboard/edit/hemicode');

    return {
      success: true,
      message: `${data.length} hemicodes updated successfully.`,
      errors: []
    };
  });
