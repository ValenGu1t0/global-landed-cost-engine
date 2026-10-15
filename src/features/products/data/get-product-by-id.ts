'use server';

import db from '@/db';
import { productsTable } from '@/db/schema';
import {
  getProductByIdSchema,
  GetProductByIdSchema
} from './get-product-by-id-schema';
import { Product } from '@/db/schema';
import { ValidationError } from '@/lib/errors';
import { eq } from 'drizzle-orm';

export async function getProductById(
  input: GetProductByIdSchema
): Promise<Product | null> {
  const result = getProductByIdSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error));
  }

  const parsedInput = result.data;

  const product = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, parsedInput.id))
    .limit(1);

  return (product[0] as Product) || null;
}
