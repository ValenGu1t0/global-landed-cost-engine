'use server';

import db from '@/db';
import { productTable, ProductTable } from '@/db/schema';
import {
  getProductsToActivateSchema,
  GetProductsToActivateSchema
} from './get-products-to-activate-schema';
import { ValidationError } from '@/lib/errors';
import { and, asc, desc, SQL, count, inArray, ne, ilike } from 'drizzle-orm';

export async function getProductsToActivate(
  input: GetProductsToActivateSchema
): Promise<{
  products: ProductTable[];
  totalCount: number;
}> {
  const result = getProductsToActivateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error));
  }

  const parsedInput = result.data;
  const page = parsedInput.page || 1;
  const limit = parsedInput.limit || 10;
  const offset = (page - 1) * limit;

  const conditions = [];

  // Status
  if (parsedInput.status && parsedInput.status.length > 0) {
    conditions.push(inArray(productTable.status, parsedInput.status));
  }

  // Hemicode search
  if (parsedInput.hemicode) {
    conditions.push(ilike(productTable.hemicode, `%${parsedInput.hemicode}%`));
  }

  // IDs seleccionados (excel selección)
  if (parsedInput.ids && parsedInput.ids.length > 0) {
    conditions.push(inArray(productTable.tech_sku_id, parsedInput.ids));
  }

  // Traemos todos los que NO sean ACTIVE
  conditions.push(ne(productTable.status, 'ACTIVE'));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const orderByMap: Record<string, any> = {
    id: productTable.tech_sku_id,
    hemicode: productTable.hemicode
  };

  const orderByClause: SQL[] = [];
  if (parsedInput.sortBy && orderByMap[parsedInput.sortBy]) {
    const col = orderByMap[parsedInput.sortBy];
    orderByClause.push(
      parsedInput.sortDirection === 'desc' ? desc(col) : asc(col)
    );
  }

  const filteredProducts = await db
    .select()
    .from(productTable)
    .where(whereClause)
    .orderBy(
      ...(orderByClause.length > 0
        ? orderByClause
        : [asc(productTable.tech_sku_id)])
    )
    .limit(limit)
    .offset(offset);

  const [{ count: totalCount }] = await db
    .select({ count: count() })
    .from(productTable)
    .where(whereClause);

  return {
    products: filteredProducts as ProductTable[],
    totalCount
  };
}
