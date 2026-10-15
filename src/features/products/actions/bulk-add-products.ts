'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { bulkAddProductsSchema } from './bulk-add-products-schema';
import db from '@/db';
import { productsTable } from '@/db/schema';
import * as XLSX from 'xlsx';
import { sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { createManyProductData, ProductInput } from '../lib/product-factory';
import {
  validateExcelRowCount,
  checkAndConsumeDemoQuota
} from '@/lib/demo-guardrails';

export const bulkAddProducts = authActionClient
  .metadata({ actionName: 'bulkAddProducts' })
  .inputSchema(bulkAddProductsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const file = Array.isArray(parsedInput.excel)
      ? parsedInput.excel[0]
      : parsedInput.excel;
    if (!file) {
      throw new Error('No se recibió ningún archivo Excel.');
    }
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data: ProductInput[] = XLSX.utils.sheet_to_json(worksheet);

    /* --------------------- DEMO GUARDRAILS --------------------- */
    const rowGuard = validateExcelRowCount(data, 'products');
    if (rowGuard) {
      throw new Error(rowGuard.message);
    }

    const quotaCheck = await checkAndConsumeDemoQuota(
      ctx?.session?.user?.id,
      data.length,
      'product_create'
    );
    if (!quotaCheck.allowed) {
      throw new Error(quotaCheck.message || 'Daily demo quota reached.');
    }

    const requiredColumns = ['name', 'category', 'price', 'description'];
    const firstRow = data[0];
    const missingColumns = requiredColumns.filter((col) => !(col in firstRow));

    if (missingColumns.length > 0) {
      throw new Error(
        `Faltan las siguientes columnas en el Excel: ${missingColumns.join(', ')}`
      );
    }

    const productsToInsert = createManyProductData(data, ctx.session.user.id);

    const result = await db
      .insert(productsTable)
      .values(productsToInsert)
      .onConflictDoUpdate({
        target: [productsTable.name, productsTable.user_id],
        set: {
          category: sql`excluded.category`,
          price: sql`excluded.price`,
          description: sql`excluded.description`,
          photo_url: sql`excluded.photo_url`,
          updated_at: sql`excluded.updated_at`
        }
      })
      .returning();

    revalidatePath('/dashboard/product');

    return {
      message: `${result.length} producto(s) agregados exitosamente`
    };
  });
