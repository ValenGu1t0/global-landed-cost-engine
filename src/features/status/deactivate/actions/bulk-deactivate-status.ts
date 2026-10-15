'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { bulkDeactivateStatusSchema } from './bulk-deactivate-status-schema';
import db from '@/db';
import { productTable } from '@/db/schema';
import { inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const bulkDeactivateStatus = authActionClient
  .metadata({ actionName: 'bulkDeactivateStatus' })
  .inputSchema(bulkDeactivateStatusSchema)
  .action(async ({ parsedInput }) => {
    await db
      .update(productTable)
      .set({
        status: parsedInput.status
      })
      .where(inArray(productTable.tech_sku_id, parsedInput.tech_sku_id));

    // Recompute product economics with the deterministic engine
    import('@/features/products_view/actions/recalculate-landed-costs').then(
      async ({ recalculateAllProductLandedCosts }) => {
        try {
          await recalculateAllProductLandedCosts();
        } catch (err) {
          console.error(
            'Landed cost recalculation error after deactivation:',
            err
          );
        }
      }
    );

    revalidatePath('/dashboard/edit/status/deactivate');

    return {
      message: `Deactivated ${parsedInput.tech_sku_id.length} products`
    };
  });
