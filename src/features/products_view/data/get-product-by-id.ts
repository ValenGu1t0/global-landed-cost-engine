'use server';

import db from '@/db';
import { productTable, productViewTable, ProductTable } from '@/db/schema';
import {
  getProductByIdSchema,
  GetProductByIdSchema
} from './get-product-by-id-schema';
import { ValidationError } from '@/lib/errors';
import { eq } from 'drizzle-orm';
import { calculateProductEconomics } from '@/lib/calculator/landed-cost-engine';

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

  const mergedBase = {
    ...(view ?? {}),
    ...Object.fromEntries(
      Object.entries(prod ?? {}).filter(
        ([, val]) => val !== null && val !== undefined
      )
    )
  };

  const calculated = calculateProductEconomics(mergedBase);

  return {
    ...calculated,
    ...mergedBase,
    fob:
      prod?.fob ??
      view?.fob_current_cost_value ??
      calculated.fob_current_cost_value,
    exw:
      prod?.exw ??
      view?.exw_current_cost_value ??
      calculated.exw_current_cost_value,
    ddp:
      prod?.ddp ??
      view?.ddp_current_cost_value ??
      calculated.ddp_current_cost_value,
    cnf:
      prod?.cnf ??
      view?.cnf_current_cost_value ??
      calculated.cnf_current_cost_value,
    cnf_diff:
      prod?.cnf_diff ??
      view?.cnf_diff_current_cost_value ??
      calculated.cnf_diff_current_cost_value,
    mrsp: prod?.mrsp ?? view?.mrsp ?? null,
    cbm: prod?.cbm ?? view?.case_cbm ?? calculated.case_cbm,
    product_length_mm:
      prod?.product_length_mm ??
      view?.product_length_mm ??
      calculated.product_length_mm,
    product_width_mm:
      prod?.product_width_mm ??
      view?.product_width_mm ??
      calculated.product_width_mm,
    product_height_mm:
      prod?.product_height_mm ??
      view?.product_height_mm ??
      calculated.product_height_mm,
    product_length_cm:
      prod?.product_length_cm ??
      view?.product_length_cm ??
      calculated.product_length_cm,
    product_width_cm:
      prod?.product_width_cm ??
      view?.product_width_cm ??
      calculated.product_width_cm,
    product_height_cm:
      prod?.product_height_cm ??
      view?.product_height_cm ??
      calculated.product_height_cm,
    product_length_in:
      prod?.product_length_in ??
      view?.product_length_in ??
      calculated.product_length_in,
    product_width_in:
      prod?.product_width_in ??
      view?.product_width_in ??
      calculated.product_width_in,
    product_height_in:
      prod?.product_height_in ??
      view?.product_height_in ??
      calculated.product_height_in,
    landed_cost_usa:
      view?.landed_cost_usa ??
      prod?.landed_cost_usa ??
      calculated.landed_cost_usa,
    landed_cost_canada:
      view?.landed_cost_canada ??
      prod?.landed_cost_canada ??
      calculated.landed_cost_canada,
    landed_cost_france:
      view?.landed_cost_france ??
      prod?.landed_cost_france ??
      calculated.landed_cost_france,
    landed_cost_morocco:
      view?.landed_cost_morocco ??
      prod?.landed_cost_morocco ??
      calculated.landed_cost_morocco,
    landed_cost_israel:
      view?.landed_cost_israel ??
      prod?.landed_cost_israel ??
      calculated.landed_cost_israel
  } as unknown as ProductTable;
}
