'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { deleteProductSchema } from './delete-product-schema';
import db from '@/db';
import { productsTable } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { ValidationError } from '@/lib/errors';

export const deleteProduct = authActionClient
  .metadata({ actionName: 'deleteProduct' })
  .inputSchema(deleteProductSchema)
  .action(async ({ parsedInput, ctx }) => {
    const result = await db
      .delete(productsTable)
      .where(
        and(
          eq(productsTable.id, parsedInput.id),
          eq(productsTable.user_id, ctx.session.user.id)
        )
      )
      .returning();

    if (result.length == 0) {
      throw new ValidationError('Product was not deleted');
    }

    revalidatePath('/dashboard/product');

    return {
      message: 'Delete product successful'
    };
  });
