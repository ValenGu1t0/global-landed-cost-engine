'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { bulkDeactivationExcelSchema } from './bulk-deactivation-excel-schema';
import db from '@/db';
import { productTable } from '@/db/schema';
import * as XLSX from 'xlsx';
import { inArray, and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { validateExcelRowCount } from '@/lib/demo-guardrails';

export const bulkDeactivationExcel = authActionClient
  .metadata({ actionName: 'bulkDeactivateProducts' })
  .inputSchema(bulkDeactivationExcelSchema)
  .action(async ({ parsedInput }) => {
    const file = Array.isArray(parsedInput.excel)
      ? parsedInput.excel[0]
      : parsedInput.excel;

    if (!file) {
      return {
        success: false,
        message: 'No Excel file received.',
        errors: ['No Excel file was provided.']
      };
    }

    // ---------- LECTURA DEL ARCHIVO ----------
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

    /* --------------------- DEMO GUARDRAILS --------------------- */
    const rowGuard = validateExcelRowCount(data, 'deactivations');
    if (rowGuard) {
      return rowGuard;
    }

    const rows = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });
    const headerRow = rows[0].map((h) => String(h).trim());

    // Solo importa cn_code + status
    const requiredColumns = ['cn_code'];

    const missing = requiredColumns.filter((col) => !headerRow.includes(col));
    if (missing.length > 0) {
      return {
        success: false,
        message: 'Missing required columns.',
        errors: [
          `The following required columns are missing: ${missing.join(', ')}`
        ]
      };
    }

    // ---------- VALIDACIONES ----------
    const errors: string[] = [];
    const cn_codes: string[] = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowIndex = i + 2; // Excel rows start at 2

      const cn_code = String(row.cn_code || '').trim();

      // CN-Code vacío
      if (!cn_code) {
        errors.push(`[Row ${rowIndex}] cn_code cannot be empty.`);
        continue;
      }
      cn_codes.push(cn_code);
    }

    const duplicates = cn_codes.filter((h, i) => cn_codes.indexOf(h) !== i);

    if (duplicates.length > 0) {
      const seen: Record<string, boolean> = {};
      const uniqueDuplicates = duplicates.filter((h) => {
        if (seen[h]) return false;
        seen[h] = true;
        return true;
      });

      errors.push(
        `The following cn_codes are duplicated inside the Excel: ${uniqueDuplicates.join(', ')}`
      );
    }

    // Si hay errores hasta acá → cortar
    if (errors.length > 0) {
      return {
        success: false,
        message: 'Errors found in the Excel file.',
        errors
      };
    }

    // ---------- VALIDAR QUE EXISTEN EN DB ----------
    const existing = await db
      .select({ cn_code: productTable.cn_code })
      .from(productTable)
      .where(inArray(productTable.cn_code, cn_codes));

    const existingCnCodes = existing.map((e) => e.cn_code);
    const missingInDb = cn_codes.filter((h) => !existingCnCodes.includes(h));

    if (missingInDb.length > 0) {
      return {
        success: false,
        message: 'Some cn_codes do not exist in the database.',
        errors: [`CN-Codes not found in DB: ${missingInDb.join(', ')}`]
      };
    }

    const inactiveProducts = await db
      .select({ cn_code: productTable.cn_code })
      .from(productTable)
      .where(
        and(
          inArray(productTable.cn_code, cn_codes),
          eq(productTable.status, 'INACTIVE')
        )
      );

    if (inactiveProducts.length > 0) {
      const inactiveCnCodes = inactiveProducts.map((p) => p.cn_code);

      return {
        success: false,
        message: 'Some products are already inactive.',
        errors: [
          `The following cn_codes are already INACTIVE: ${inactiveCnCodes.join(', ')}`
        ]
      };
    }

    // ---------- TRANSACCIÓN ----------
    await db.transaction(async (tx) => {
      await tx
        .update(productTable)
        .set({ status: 'INACTIVE' })
        .where(inArray(productTable.cn_code, cn_codes));
    });

    // Recompute product economics with the deterministic engine
    import('@/features/products_view/actions/recalculate-landed-costs').then(
      async ({ recalculateAllProductLandedCosts }) => {
        try {
          await recalculateAllProductLandedCosts();
        } catch (err) {
          console.error(
            'Landed cost recalculation error after deactivation:',
            err
          );
        }
      }
    );

    revalidatePath('/dashboard/edit/status/deactivate');

    return {
      success: true,
      message: `${cn_codes.length} products successfully deactivated!`,
      errors: []
    };
  });
