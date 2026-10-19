'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { bulkActivationExcelSchema } from './bulk-activation-excel-schema';
import db from '@/db';
import { productTable } from '@/db/schema';
import * as XLSX from 'xlsx';
import { inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { validateProductActivate } from '../lib/product-validations';
import { validateExcelRowCount } from '@/lib/demo-guardrails';

export const bulkActivationExcel = authActionClient
  .metadata({ actionName: 'bulkActivateProducts' })
  .inputSchema(bulkActivationExcelSchema)
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

    // ---------- READ EXCEL ----------
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });
    const headerRow = rows[0].map((h) => String(h).trim().toLowerCase());

    const data = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

    /* --------------------- DEMO GUARDRAILS --------------------- */
    const rowGuard = validateExcelRowCount(data, 'activations');
    if (rowGuard) {
      return rowGuard;
    }

    // ---------- REQUIRED COLUMNS ----------
    if (!headerRow.includes('cn_code')) {
      return {
        success: false,
        message: 'Missing required columns.',
        errors: ['The column "cn_code" is required.']
      };
    }

    // ---------- BASIC VALIDATION ----------
    const errors: string[] = [];
    const cn_codes: string[] = [];

    data.forEach((row, i) => {
      const rowIndex = i + 2;
      const cn_code = String(row.cn_code || '').trim();

      if (!cn_code) {
        errors.push(`[Row ${rowIndex}] cn_code cannot be empty.`);
        return;
      }

      cn_codes.push(cn_code);
    });

    // Duplicates
    const duplicates = cn_codes.filter((h, i) => cn_codes.indexOf(h) !== i);

    if (duplicates.length > 0) {
      const unique = duplicates.filter(
        (value, index, self) => self.indexOf(value) === index
      );

      errors.push(`Duplicated cn_codes in Excel: ${unique.join(', ')}`);
    }

    if (errors.length > 0) {
      return {
        success: false,
        message: 'Errors found in the Excel file.',
        errors
      };
    }

    // ---------- FETCH PRODUCTS ----------
    const products = await db
      .select()
      .from(productTable)
      .where(inArray(productTable.cn_code, cn_codes));

    if (products.length !== cn_codes.length) {
      const found = products.map((p) => p.cn_code);
      const missing = cn_codes.filter((h) => !found.includes(h));

      return {
        success: false,
        message: 'Some cn_codes do not exist.',
        errors: [`CN-Codes not found: ${missing.join(', ')}`]
      };
    }

    // ---------- STATUS CHECK ----------
    const alreadyActive = products.filter((p) => p.status === 'ACTIVE');

    if (alreadyActive.length > 0) {
      return {
        success: false,
        message: 'Some products are already ACTIVE.',
        errors: [
          `Already ACTIVE: ${alreadyActive.map((p) => p.cn_code).join(', ')}`
        ]
      };
    }

    // ---------- BUSINESS VALIDATIONS ----------
    products.forEach((product, i) => {
      const rowErrors = validateProductActivate(product, i, headerRow);

      errors.push(...rowErrors);
    });

    if (errors.length > 0) {
      return {
        success: false,
        message: 'Validation errors found.',
        errors
      };
    }

    // ---------- TRANSACTION ----------
    await db.transaction(async (tx) => {
      await tx
        .update(productTable)
        .set({ status: 'ACTIVE' })
        .where(inArray(productTable.cn_code, cn_codes));
    });

    // Recompute product economics with the deterministic engine
    import('@/features/products_view/actions/recalculate-landed-costs').then(
      async ({ recalculateAllProductLandedCosts }) => {
        try {
          await recalculateAllProductLandedCosts();
        } catch (err) {
          console.error(
            'Landed cost recalculation error after activation:',
            err
          );
        }
      }
    );

    revalidatePath('/dashboard/edit/status/activate');

    return {
      success: true,
      message: `${cn_codes.length} products successfully activated!`,
      errors: []
    };
  });
