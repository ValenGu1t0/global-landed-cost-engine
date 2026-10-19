'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { updateProductSchema } from './update-product-schema';
import db from '@/db';
import {
  productTable,
  productHistoricCostsTable,
  productViewTable
} from '@/db/schema';
import { and, eq, gt, ne } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { COST_MAP } from '@/constants/data';
import { calculateProductEconomics } from '@/lib/calculator/landed-cost-engine';

export const updateProduct = authActionClient
  .metadata({ actionName: 'updateProduct' })
  .inputSchema(updateProductSchema)
  .action(async ({ parsedInput }) => {
    const now = new Date();
    const nowIso = now.toISOString();
    const endOfTimes = new Date('2100-01-01T00:00:00.000Z');

    const { tech_sku_id } = parsedInput;

    // Traemos el producto a editar
    const [currentProduct] = await db
      .select()
      .from(productTable)
      .where(eq(productTable.tech_sku_id, tech_sku_id))
      .limit(1);

    if (!currentProduct) {
      throw new Error(`Product not found: ${tech_sku_id}`);
    }

    // Si se llega a modificar el cn_code, chequeamos que no exista ya en la DB
    if (parsedInput.cn_code && parsedInput.cn_code !== currentProduct.cn_code) {
      const repeated = await db
        .select()
        .from(productTable)
        .where(
          and(
            eq(productTable.cn_code, parsedInput.cn_code),
            ne(productTable.tech_sku_id, tech_sku_id)
          )
        )
        .limit(1);

      if (repeated.length > 0) {
        throw new Error(
          `Product with this cn_code already exists: ${parsedInput.cn_code}`
        );
      }
    }

    // Extraer commentaries para que NO vayan al productTable
    const {
      fob_commentary,
      exw_commentary,
      cnf_commentary,
      ddp_commentary,
      cnf_diff_commentary,
      ...restToUpdateRaw
    } = parsedInput;

    const updateData = {
      ...restToUpdateRaw,
      updated_at: nowIso
    };

    // Mapa de commentaries para usar al insertar en tabla historic
    const commentaryMap: Record<string, string | undefined> = {
      fob_commentary,
      exw_commentary,
      cnf_commentary,
      ddp_commentary,
      cnf_diff_commentary
    };

    // Si el producto está en ACTIVE o PROJECT no se puede updatear NO existe al menos 1 valor entre los 5 campos: fob, exw, cnf, ddp, cnf_diff
    const costFields: Array<keyof typeof COST_MAP> = Object.keys(
      COST_MAP
    ) as Array<keyof typeof COST_MAP>;

    // Calculamos el estado "después del update": si parsedInput tiene el campo, usamos ese, si no, usamos el valor actual en DB.
    let costsAfterCount = 0;
    for (const field of costFields) {
      const newVal = (parsedInput as any)[field];
      const oldVal = (currentProduct as any)[field];

      const finalVal = newVal !== undefined ? newVal : oldVal;
      if (finalVal != null) costsAfterCount++;
    }

    const status = (parsedInput.status ?? currentProduct.status) as
      | string
      | undefined;
    if (
      status &&
      (status === 'ACTIVE' || status === 'PROJECT' || status === 'GS') &&
      costsAfterCount === 0
    ) {
      throw new Error(
        `Validation error: products with status "${status}" must have at least one cost value among fob, exw, cnf, ddp or cnf_diff.`
      );
    }

    // Además, detectamos cambios en los 5 incoterms para procesar en historic
    let closedHistoricCount = 0;
    let insertedHistoricCount = 0;

    if (typeof db.transaction === 'function') {
      await db.transaction(async (tx) => {
        for (const field of costFields) {
          const prevValue = (currentProduct as any)[field];
          const newValue = (parsedInput as any)[field];

          const { incoterm, commentary } = COST_MAP[field];
          const commentaryValue = commentaryMap[commentary] ?? 'Sin comentario';

          const valueWasPresent = prevValue != null;
          const newValueEffective =
            newValue === undefined ? prevValue : newValue;
          const valueIsPresentNow = newValueEffective != null;

          // - si antes tenía y ahora no => changed
          // - si antes tenía y ahora tiene distinto => changed
          // - si antes no tenía y ahora tiene => changed
          const valueChanged =
            (valueWasPresent && !valueIsPresentNow) ||
            (valueWasPresent &&
              valueIsPresentNow &&
              prevValue !== newValueEffective) ||
            (!valueWasPresent && valueIsPresentNow);

          if (valueChanged && valueWasPresent) {
            // Cerrar histórico activo para este tech_sku_id + incoterm
            await tx
              .update(productHistoricCostsTable)
              .set({ end_date: now })
              .where(
                and(
                  eq(productHistoricCostsTable.tech_sku_id, tech_sku_id),
                  eq(productHistoricCostsTable.import_incoterm, incoterm),
                  gt(productHistoricCostsTable.end_date, now)
                )
              );
            closedHistoricCount++;
          }

          // Si ahora hay valor y (antes no lo había o cambio), insertar nuevo histórico
          const shouldInsert =
            valueIsPresentNow &&
            (!valueWasPresent ||
              (valueWasPresent && prevValue !== newValueEffective));

          if (shouldInsert) {
            await tx.insert(productHistoricCostsTable).values({
              tech_sku_id,
              start_date: now,
              end_date: endOfTimes,
              cost: newValueEffective,
              cost_update_commentary: commentaryValue,
              import_incoterm: incoterm
            });

            insertedHistoricCount++;
          }
        }

        await tx
          .update(productTable)
          .set(updateData)
          .where(eq(productTable.tech_sku_id, tech_sku_id));
      });
    } else {
      for (const field of costFields) {
        const prevValue = (currentProduct as any)[field];
        const newValue = (parsedInput as any)[field];

        const { incoterm, commentary } = COST_MAP[field];
        const commentaryValue = commentaryMap[commentary] ?? 'Sin comentario';

        const valueWasPresent = prevValue != null;
        const newValueEffective = newValue === undefined ? prevValue : newValue;
        const valueIsPresentNow = newValueEffective != null;

        const valueChanged =
          (valueWasPresent && !valueIsPresentNow) ||
          (valueWasPresent &&
            valueIsPresentNow &&
            prevValue !== newValueEffective) ||
          (!valueWasPresent && valueIsPresentNow);

        if (valueChanged && valueWasPresent) {
          await db
            .update(productHistoricCostsTable)
            .set({ end_date: now })
            .where(
              and(
                eq(productHistoricCostsTable.tech_sku_id, tech_sku_id),
                eq(productHistoricCostsTable.import_incoterm, incoterm),
                gt(productHistoricCostsTable.end_date, now)
              )
            );
          closedHistoricCount++;
        }

        const shouldInsert =
          valueIsPresentNow &&
          (!valueWasPresent ||
            (valueWasPresent && prevValue !== newValueEffective));

        if (shouldInsert) {
          await db.insert(productHistoricCostsTable).values({
            tech_sku_id,
            start_date: now,
            end_date: endOfTimes,
            cost: newValueEffective,
            cost_update_commentary: commentaryValue,
            import_incoterm: incoterm
          });

          insertedHistoricCount++;
        }
      }

      await db
        .update(productTable)
        .set(updateData)
        .where(eq(productTable.tech_sku_id, tech_sku_id));
    }

    // Recalculate container economics & Landed Costs on-the-fly
    const [updatedProduct] = await db
      .select()
      .from(productTable)
      .where(eq(productTable.tech_sku_id, tech_sku_id))
      .limit(1);

    if (updatedProduct) {
      const economics = calculateProductEconomics({
        ...updatedProduct,
        fob_current_cost_value: parsedInput.fob ?? undefined,
        exw_current_cost_value: parsedInput.exw ?? undefined,
        cnf_current_cost_value: parsedInput.cnf ?? undefined,
        ddp_current_cost_value: parsedInput.ddp ?? undefined,
        mrsp: parsedInput.mrsp ?? undefined,
        commission_percentage: parsedInput.commission_percentage ?? undefined
      });

      await db
        .update(productViewTable)
        .set({
          ...economics,
          ...(parsedInput.cn_code ? { cn_code: parsedInput.cn_code } : {}),
          ...(parsedInput.description
            ? { description: parsedInput.description }
            : {}),
          ...(parsedInput.vendor ? { vendor: parsedInput.vendor } : {}),
          ...(parsedInput.category ? { category: parsedInput.category } : {}),
          ...(parsedInput.fob !== undefined
            ? { fob_current_cost_value: parsedInput.fob }
            : {}),
          ...(parsedInput.mrsp !== undefined ? { mrsp: parsedInput.mrsp } : {})
        })
        .where(eq(productViewTable.tech_sku_id, tech_sku_id));
    }

    revalidatePath('/dashboard/products_view');
    revalidatePath(`/dashboard/products_view/${tech_sku_id}`);

    return {
      message: 'Product updated successfully',
      tech_sku_id,
      closedHistoricCount,
      insertedHistoricCount
    };
  });
