'use server';

import db from '@/db';
import { groundFreightTable } from '@/db/schema';
import {
  getGroundFreightsSchema,
  GetGroundFreightsSchema
} from './get-ground-freight-schema';
import { ValidationError } from '@/lib/errors';
import { or, asc, desc, SQL, count, inArray, sql } from 'drizzle-orm';

export async function getGroundFreight(
  input: GetGroundFreightsSchema
): Promise<{
  ground_freight: any[];
  totalCount: number;
}> {
  const result = getGroundFreightsSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error));
  }

  const parsedInput = result.data;

  const page = parsedInput.page || 1;
  const limit = parsedInput.perPage || 10;
  const offset = (page - 1) * limit;

  const conditions: any[] = [];

  if (parsedInput.search) {
    const search = parsedInput.search.toLowerCase();
    const s = `%${search}%`;

    conditions.push(
      or(
        sql`LOWER(${groundFreightTable.vendor}) LIKE ${s}`,
        sql`LOWER(${groundFreightTable.factory_name}) LIKE ${s}`,
        sql`LOWER(${groundFreightTable.origin_country}) LIKE ${s}`,
        sql`LOWER(${groundFreightTable.destination_country}) LIKE ${s}`,
        sql`LOWER(${groundFreightTable.destination_warehouse}) LIKE ${s}`,
        sql`LOWER(${groundFreightTable.container_type}) LIKE ${s}`,
        sql`LOWER(${groundFreightTable.cost_detail}) LIKE ${s}`,
        sql`LOWER(${groundFreightTable.cost_group}) LIKE ${s}`
      )
    );
  }

  if (parsedInput.ids && parsedInput.ids.length > 0) {
    conditions.push(inArray(groundFreightTable.id, parsedInput.ids));
  }

  const whereClause =
    conditions.length > 0
      ? sql`${sql.join(conditions, sql` AND `)}`
      : undefined;

  const columnMap: Record<string, any> = {
    id: groundFreightTable.id,
    vendor: groundFreightTable.vendor,
    factory_name: groundFreightTable.factory_name,
    origin_country: groundFreightTable.origin_country,
    destination_country: groundFreightTable.destination_country,
    destination_warehouse: groundFreightTable.destination_warehouse,
    container_type: groundFreightTable.container_type,
    cost_detail: groundFreightTable.cost_detail,
    value: groundFreightTable.value,
    cost_group: groundFreightTable.cost_group,
    start_date: groundFreightTable.start_date,
    end_date: groundFreightTable.end_date,
    user: groundFreightTable.user
  };

  const orderByClause: SQL[] = [];
  if (parsedInput.sortBy) {
    const col = columnMap[parsedInput.sortBy];
    if (col) {
      const isDesc = parsedInput.sortDirection === 'desc';
      orderByClause.push(isDesc ? desc(col) : asc(col));
    }
  }

  let query;
  if (parsedInput.columns && parsedInput.columns.length > 0) {
    const selectedCols: Record<string, any> = {
      id: groundFreightTable.id
    };

    parsedInput.columns.forEach((col) => {
      if (columnMap[col]) selectedCols[col] = columnMap[col];
    });

    query = db.select(selectedCols);
  } else {
    query = db.select();
  }

  const ground_freight = await query
    .from(groundFreightTable)
    .where(whereClause)
    .orderBy(
      ...(orderByClause.length > 0
        ? orderByClause
        : [asc(groundFreightTable.id)])
    )
    .limit(limit)
    .offset(offset);

  const [{ count: totalCount }] = await db
    .select({ count: count() })
    .from(groundFreightTable)
    .where(whereClause);

  return {
    ground_freight,
    totalCount
  };
}
