'use server';

import db from '@/db';
import { productTable, productViewTable, ProductTable } from '@/db/schema';
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

  const [productRows, viewRows] = await Promise.all([
    db
      .select()
      .from(productTable)
      .where(eq(productTable.tech_sku_id, parsedInput.tech_sku_id))
      .limit(1),
    db
      .select()
      .from(productViewTable)
      .where(eq(productViewTable.tech_sku_id, parsedInput.tech_sku_id))
      .limit(1)
  ]);

  const prod = productRows[0];
  const view = viewRows[0];

  if (!prod && !view) {
    return null;
  }

  return {
    ...(view ?? {}),
    ...(prod ?? {}),
    fob: prod?.fob ?? view?.fob_current_cost_value ?? null,
    exw: prod?.exw ?? view?.exw_current_cost_value ?? null,
    ddp: prod?.ddp ?? view?.ddp_current_cost_value ?? null,
    cnf: prod?.cnf ?? view?.cnf_current_cost_value ?? null,
    cnf_diff: prod?.cnf_diff ?? view?.cnf_diff_current_cost_value ?? null,
    mrsp: prod?.mrsp ?? view?.mrsp ?? null,
    cbm: prod?.cbm ?? view?.case_cbm ?? null
  } as unknown as ProductTable;
}
