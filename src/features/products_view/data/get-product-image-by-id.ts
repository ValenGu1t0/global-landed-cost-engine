'use server';

import db from '@/db';
import { productPicturesTable } from '@/db/schema';
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
    const pictures = await db
      .select({ imagePath: productPicturesTable.image_path })
      .from(productPicturesTable)
      .where(eq(productPicturesTable.tech_sku_id, parsedInput.tech_sku_id));

    const fullImageUrls = pictures.map((picture) =>
      resolveProductImageUrl(picture.imagePath)
    );

    return fullImageUrls;
  } catch (error) {
    throw new Error("Couldn't get the product images.");
  }
}
