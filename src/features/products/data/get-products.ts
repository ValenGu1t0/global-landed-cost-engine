'use server';

import db from '@/db';
import { productsTable } from '@/db/schema';
import { getProductsSchema, GetProductsSchema } from './get-products-schema';
import { Product } from '@/db/schema';
import { ValidationError } from '@/lib/errors';
import { eq, like, and, or, asc, desc, SQL, count, inArray } from 'drizzle-orm';
import { getAuthContext } from '@/lib/context';

export async function getProducts(input: GetProductsSchema): Promise<{
  products: Product[];
  totalCount: number;
}> {
  const result = getProductsSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error));
  }
  const ctx = await getAuthContext();

  const parsedInput = result.data;
  const page = parsedInput.page || 1;
  const limit = parsedInput.limit || 10;
  const offset = (page - 1) * limit;

  const conditions = [];

  if (parsedInput.search) {
    conditions.push(
      or(
        like(productsTable.name, `%${parsedInput.search}%`),
        like(productsTable.description, `%${parsedInput.search}%`),
        like(productsTable.category, `%${parsedInput.search}%`)
      )
    );
  }

  if (parsedInput.category) {
    const categories = parsedInput.category.split(',').filter(Boolean);
    if (categories.length > 0) {
      conditions.push(
        or(...categories.map((cat) => eq(productsTable.category, cat.trim())))
      );
    }
  }

  if (parsedInput.ids && parsedInput.ids.length > 0) {
    conditions.push(inArray(productsTable.id, parsedInput.ids));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const columnMap: Record<string, any> = {
    id: productsTable.id,
    name: productsTable.name,
    description: productsTable.description,
    price: productsTable.price,
    category: productsTable.category,
    created_at: productsTable.created_at,
    updated_at: productsTable.updated_at,
    photo_url: productsTable.photo_url,
    user_id: productsTable.user_id
  };

  const orderByClause: SQL[] = [];
  if (parsedInput.sortBy) {
    const column = columnMap[parsedInput.sortBy];
    if (column) {
      const isDesc = parsedInput.sortDirection === 'desc';
      orderByClause.push(isDesc ? desc(column) : asc(column));
    }
  }

  let query;
  if (parsedInput.columns && parsedInput.columns.length > 0) {
    const selectColumns: Record<string, any> = { id: productsTable.id };
    parsedInput.columns.forEach((col) => {
      if (columnMap[col]) selectColumns[col] = columnMap[col];
    });
    query = db.select(selectColumns);
  } else {
    query = db.select();
  }

  const filteredProducts = await query
    .from(productsTable)
    .where(and(whereClause, eq(productsTable.user_id, ctx.session.user.id)))
    .orderBy(
      ...(orderByClause.length > 0 ? orderByClause : [asc(productsTable.id)])
    )
    .limit(limit)
    .offset(offset);

  const [{ count: totalCount }] = await db
    .select({ count: count() })
    .from(productsTable)
    .where(and(whereClause, eq(productsTable.user_id, ctx.session.user.id)));

  return {
    products: filteredProducts as Product[],
    totalCount
  };
}
