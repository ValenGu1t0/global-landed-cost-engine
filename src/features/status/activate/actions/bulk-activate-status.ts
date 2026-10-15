'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { bulkActivateStatusSchema } from './bulk-activate-status-schema';
import db from '@/db';
import { productTable } from '@/db/schema';
import { inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { REQUIRED_FIELDS } from '@/lib/validations/product-required';

const INCOTERM_FIELDS = ['fob', 'exw', 'ddp', 'cnf', 'cnf_diff'] as const;

function isPresent(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return !Number.isNaN(value);
  return true;
}

export const bulkActivateStatus = authActionClient
  .metadata({ actionName: 'bulkActivateStatus' })
  .inputSchema(bulkActivateStatusSchema)
  .action(async ({ parsedInput }) => {
    const { tech_sku_id } = parsedInput;
    const allErrors: string[] = [];

    /* --------------------- FETCH PRODUCTS --------------------- */
    const products = await db
      .select()
      .from(productTable)
      .where(inArray(productTable.tech_sku_id, tech_sku_id));

    if (products.length === 0) {
      return {
        success: false,
        message: 'No products were found.',
        errors: ['No valid products were selected.']
      };
    }

    /* --------------------- VALIDATIONS --------------------- */
    products.forEach((product) => {
      const prefix = `[SKU ${product.tech_sku_id}]`;

      // Required fields for ACTIVE
      const missingFields = REQUIRED_FIELDS.ACTIVE.filter(
        (field) => !isPresent(product[field as keyof typeof product])
      );

      if (missingFields.length > 0) {
        allErrors.push(
          `${prefix} Missing required fields: ${missingFields.join(', ')}`
        );
      }

      // Incoterms
      const hasAtLeastOneIncoterm = INCOTERM_FIELDS.some((field) =>
        isPresent(product[field as keyof typeof product])
      );

      if (!hasAtLeastOneIncoterm) {
        allErrors.push(
          `${prefix} At least one incoterm (fob, exw, cnf, ddp, cnf_diff) must have a value.`
        );
      }

      // Hemicode
      if (!isPresent(product.hemicode)) {
        allErrors.push(`${prefix} Hemicode is missing.`);
      }
    });

    /* --------------------- RETURN ERRORS (MODAL) --------------------- */
    if (allErrors.length > 0) {
      return {
        success: false,
        message: 'Errors found while activating products.',
        errors: allErrors
      };
    }

    /* --------------------- BULK UPDATE --------------------- */
    await db
      .update(productTable)
      .set({
        status: 'ACTIVE'
      })
      .where(inArray(productTable.tech_sku_id, tech_sku_id));

    // Recompute product economics with the deterministic engine
    import('@/features/products_view/actions/recalculate-landed-costs').then(
      async ({ recalculateAllProductLandedCosts }) => {
        try {
          await recalculateAllProductLandedCosts();
        } catch (err) {
          console.error(
            'Landed cost recalculation error after activation:',
            err
          );
        }
      }
    );

    revalidatePath('/dashboard/products_view');

    return {
      success: true,
      message: `${tech_sku_id.length} products activated successfully.`,
      errors: []
    };
  });
