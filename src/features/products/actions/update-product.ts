'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { updateProductSchema } from './update-product-schema';
import db from '@/db';
import { productsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generatePhotoUrl } from '../lib/products';
import { revalidatePath } from 'next/cache';

export const updateProduct = authActionClient
  .metadata({ actionName: 'updateProduct' })
  .inputSchema(updateProductSchema)
  .action(async ({ parsedInput }) => {
    const now = new Date();

    let photo_url: string | undefined;
    if (parsedInput.image && parsedInput.image.length > 0) {
      photo_url = generatePhotoUrl(parsedInput.name);
    }

    const updateData: any = {
      name: parsedInput.name,
      category: parsedInput.category,
      price: parsedInput.price,
      description: parsedInput.description,
      updated_at: now
    };

    if (photo_url) {
      updateData.photo_url = photo_url;
    }

    await db
      .update(productsTable)
      .set(updateData)
      .where(eq(productsTable.id, parsedInput.id));

    revalidatePath('/dashboard/product/[id]');

    return {
      message: 'Product updated successfully'
    };
  });
