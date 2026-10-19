'use server';

import db from '@/db';
import { productPicturesTable, productViewTable } from '@/db/schema';
import {
  getProductImagesBySkuIdSchema,
  GetProductImagesBySkuIdSchema
} from './get-product-image-by-id-schema';
import { ValidationError } from '@/lib/errors';
import { eq } from 'drizzle-orm';
import { resolveProductImageUrl } from '@/constants/data';

export type FullImageUrl = string;

export async function getProductImagesBySkuId(
  input: GetProductImagesBySkuIdSchema
): Promise<FullImageUrl[]> {
  const result = getProductImagesBySkuIdSchema.safeParse(input);

  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error));
  }

  const parsedInput = result.data;

  try {
    const [pictures, viewRows] = await Promise.all([
      db
        .select({ imagePath: productPicturesTable.image_path })
        .from(productPicturesTable)
        .where(eq(productPicturesTable.tech_sku_id, parsedInput.tech_sku_id)),
      db
        .select({ imagePath: productViewTable.image_path })
        .from(productViewTable)
        .where(eq(productViewTable.tech_sku_id, parsedInput.tech_sku_id))
        .limit(1)
    ]);

    const rawPaths = [
      ...pictures.map((p) => p.imagePath),
      ...(viewRows[0]?.imagePath ? [viewRows[0].imagePath] : [])
    ].filter((p): p is string => Boolean(p && p.trim().length > 0));

    const uniqueUrls = Array.from(
      new Set(rawPaths.map((p) => resolveProductImageUrl(p)))
    );

    return uniqueUrls;
  } catch (error) {
    throw new Error("Couldn't get the product images.");
  }
}
