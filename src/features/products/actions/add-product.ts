'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { addProductSchema } from './add-product-schema';
import db from '@/db';
import { productsTable } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { createProductData } from '../lib/product-factory';
import { ValidationError } from '@/lib/errors';
import { and, eq } from 'drizzle-orm';
import { checkAndConsumeDemoQuota } from '@/lib/demo-guardrails';

export const addProduct = authActionClient
  .metadata({ actionName: 'addProduct' })
  .inputSchema(addProductSchema)
  .action(async ({ parsedInput, ctx }) => {
    const quotaCheck = await checkAndConsumeDemoQuota(
      ctx?.session?.user?.id,
      1,
      'product_create'
    );
    if (!quotaCheck.allowed) {
      throw new ValidationError(
        quotaCheck.message ||
          'Daily demo quota exceeded: A maximum of 10 products can be created per day.'
      );
    }

    const productData = createProductData(
      {
        name: parsedInput.name,
        category: parsedInput.category,
        price: parsedInput.price,
        description: parsedInput.description
      },
      ctx.session.user.id
    );

    const existingProduct = await db
      .select()
      .from(productsTable)
      .where(
        and(
          eq(productsTable.name, productData.name),
          eq(productsTable.user_id, ctx.session.user.id)
        )
      );
    if (existingProduct.length > 0) {
      throw new ValidationError('Product already exists');
    }

    await db.insert(productsTable).values(productData);

    revalidatePath('/dashboard/product');
    return { message: 'Add product successful' };
  });
