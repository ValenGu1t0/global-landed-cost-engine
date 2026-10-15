'use server';

import db from '@/db';
import { productTable, ProductTable } from '@/db/schema';
import {
  getProductByIdSchema,
  GetProductByIdSchema
} from './get-product-by-id-schema';
import { ValidationError } from '@/lib/errors';
import { eq } from 'drizzle-orm';

export async function getProductById(
  input: GetProductByIdSchema
): Promise<ProductTable | null> {
  const result = getProductByIdSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error));
  }

  const parsedInput = result.data;

  const product = await db
    .select()
    .from(productTable)
    .where(eq(productTable.tech_sku_id, parsedInput.tech_sku_id))
    .limit(1);

  return (product[0] as ProductTable) || null;
}
