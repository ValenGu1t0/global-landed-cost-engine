'use server';

import db from '@/db';
import { incotermCostGroupTable } from '@/db/schema';
import {
  getIncotermCostGroupsSchema,
  GetIncotermCostGroupsSchema
} from './get-incoterm_cost_groups-schema';
import { ValidationError } from '@/lib/errors';
import { or, asc, desc, SQL, count, inArray, sql } from 'drizzle-orm';

export async function getIncotermCostGroups(
  input: GetIncotermCostGroupsSchema
): Promise<{
  incoterm_cost_groups: any[];
  totalCount: number;
}> {
  const result = getIncotermCostGroupsSchema.safeParse(input);
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
        sql`LOWER(${incotermCostGroupTable.cost_group}) LIKE ${s}`,
        sql`LOWER(${incotermCostGroupTable.vendor}) LIKE ${s}`,
        sql`LOWER(${incotermCostGroupTable.country}) LIKE ${s}`,
        sql`LOWER(${incotermCostGroupTable.incoterm}) LIKE ${s}`
      )
    );
  }

  if (parsedInput.ids && parsedInput.ids.length > 0) {
    conditions.push(inArray(incotermCostGroupTable.id, parsedInput.ids));
  }

  const whereClause =
    conditions.length > 0
      ? sql`${sql.join(conditions, sql` AND `)}`
      : undefined;

  const columnMap: Record<string, any> = {
    id: incotermCostGroupTable.id,
    cost_group: incotermCostGroupTable.cost_group,
    vendor: incotermCostGroupTable.vendor,
    country: incotermCostGroupTable.country,
    incoterm: incotermCostGroupTable.incoterm
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
      id: incotermCostGroupTable.id
    };
    parsedInput.columns.forEach((col) => {
      if (columnMap[col]) selectedCols[col] = columnMap[col];
    });
    query = db.select(selectedCols);
  } else {
    query = db.select();
  }

  const incoterm_cost_groups = await query
    .from(incotermCostGroupTable)
    .where(whereClause)
    .orderBy(
      ...(orderByClause.length > 0
        ? orderByClause
        : [asc(incotermCostGroupTable.id)])
    )
    .limit(limit)
    .offset(offset);

  const [{ count: totalCount }] = await db
    .select({ count: count() })
    .from(incotermCostGroupTable)
    .where(whereClause);

  return {
    incoterm_cost_groups,
    totalCount
  };
}
