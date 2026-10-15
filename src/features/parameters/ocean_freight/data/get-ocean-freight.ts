'use server';

import db from '@/db';
import { oceanFreightTable } from '@/db/schema';
import {
  getOceanFreightsSchema,
  GetOceanFreightsSchema
} from './get-ocean-freight-schema';
import { ValidationError } from '@/lib/errors';
import { or, asc, desc, SQL, count, inArray, sql } from 'drizzle-orm';

export async function getOceanFreight(input: GetOceanFreightsSchema): Promise<{
  ocean_freight: any[];
  totalCount: number;
}> {
  const result = getOceanFreightsSchema.safeParse(input);
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
        sql`LOWER(${oceanFreightTable.origin_port}) LIKE ${s}`,
        sql`LOWER(${oceanFreightTable.origin_country}) LIKE ${s}`,
        sql`LOWER(${oceanFreightTable.destination_port}) LIKE ${s}`,
        sql`LOWER(${oceanFreightTable.destination_country}) LIKE ${s}`,
        sql`LOWER(${oceanFreightTable.container_type}) LIKE ${s}`,
        sql`LOWER(${oceanFreightTable.cost_group}) LIKE ${s}`
      )
    );
  }

  if (parsedInput.ids && parsedInput.ids.length > 0) {
    conditions.push(inArray(oceanFreightTable.id, parsedInput.ids));
  }

  const whereClause =
    conditions.length > 0
      ? sql`${sql.join(conditions, sql` AND `)}`
      : undefined;

  const columnMap: Record<string, any> = {
    id: oceanFreightTable.id,
    vendor: oceanFreightTable.origin_port,
    factory_name: oceanFreightTable.origin_country,
    origin_country: oceanFreightTable.destination_port,
    destination_country: oceanFreightTable.destination_country,
    port_of_loading: oceanFreightTable.container_type,
    port_of_discharge: oceanFreightTable.value,
    container_type: oceanFreightTable.cost_group,
    start_date: oceanFreightTable.start_date,
    end_date: oceanFreightTable.end_date,
    user: oceanFreightTable.user
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
      id: oceanFreightTable.id
    };

    parsedInput.columns.forEach((col) => {
      if (columnMap[col]) selectedCols[col] = columnMap[col];
    });

    query = db.select(selectedCols);
  } else {
    query = db.select();
  }

  const ocean_freight = await query
    .from(oceanFreightTable)
    .where(whereClause)
    .orderBy(
      ...(orderByClause.length > 0
        ? orderByClause
        : [asc(oceanFreightTable.id)])
    )
    .limit(limit)
    .offset(offset);

  const [{ count: totalCount }] = await db
    .select({ count: count() })
    .from(oceanFreightTable)
    .where(whereClause);

  return {
    ocean_freight,
    totalCount
  };
}
