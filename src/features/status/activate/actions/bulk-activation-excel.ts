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
    if (!headerRow.includes('hemicode')) {
      return {
        success: false,
        message: 'Missing required columns.',
        errors: ['The column "hemicode" is required.']
      };
    }

    // ---------- BASIC VALIDATION ----------
    const errors: string[] = [];
    const hemicodes: string[] = [];

    data.forEach((row, i) => {
      const rowIndex = i + 2;
      const hemicode = String(row.hemicode || '').trim();

      if (!hemicode) {
        errors.push(`[Row ${rowIndex}] hemicode cannot be empty.`);
        return;
      }

      hemicodes.push(hemicode);
    });

    // Duplicates
    const duplicates = hemicodes.filter((h, i) => hemicodes.indexOf(h) !== i);

    if (duplicates.length > 0) {
      const unique = duplicates.filter(
        (value, index, self) => self.indexOf(value) === index
      );

      errors.push(`Duplicated hemicodes in Excel: ${unique.join(', ')}`);
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
      .where(inArray(productTable.hemicode, hemicodes));

    if (products.length !== hemicodes.length) {
      const found = products.map((p) => p.hemicode);
      const missing = hemicodes.filter((h) => !found.includes(h));

      return {
        success: false,
        message: 'Some hemicodes do not exist.',
        errors: [`Hemicodes not found: ${missing.join(', ')}`]
      };
    }

    // ---------- STATUS CHECK ----------
    const alreadyActive = products.filter((p) => p.status === 'ACTIVE');

    if (alreadyActive.length > 0) {
      return {
        success: false,
        message: 'Some products are already ACTIVE.',
        errors: [
          `Already ACTIVE: ${alreadyActive.map((p) => p.hemicode).join(', ')}`
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
        .where(inArray(productTable.hemicode, hemicodes));
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
      message: `${hemicodes.length} products successfully activated!`,
      errors: []
    };
  });
