'use server';

import db from '@/db';
import { portCostTable } from '@/db/schema';
import { getPortCostSchema, GetPortCostSchema } from './get-port-cost-schema';
import { ValidationError } from '@/lib/errors';
import { or, asc, desc, SQL, count, inArray, sql } from 'drizzle-orm';

export async function getPortCost(input: GetPortCostSchema): Promise<{
  port_cost: any[];
  totalCount: number;
}> {
  const result = getPortCostSchema.safeParse(input);
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
        sql`LOWER(${portCostTable.logistic_cost}) LIKE ${s}`,
        sql`LOWER(${portCostTable.cost_group}) LIKE ${s}`,
        sql`LOWER(${portCostTable.user}) LIKE ${s}`
      )
    );
  }

  if (parsedInput.ids && parsedInput.ids.length > 0) {
    conditions.push(inArray(portCostTable.id, parsedInput.ids));
  }

  const whereClause =
    conditions.length > 0
      ? sql`${sql.join(conditions, sql` AND `)}`
      : undefined;

  const columnMap: Record<string, any> = {
    id: portCostTable.id,
    logistic_cost: portCostTable.logistic_cost,
    value: portCostTable.value,
    cost_group: portCostTable.cost_group,
    user: portCostTable.user,
    start_date: portCostTable.start_date,
    end_date: portCostTable.end_date
  };

  const orderByClause: SQL[] = [];
  if (parsedInput.sortBy) {
    const col = columnMap[parsedInput.sortBy];
    if (col) {
      orderByClause.push(
        parsedInput.sortDirection === 'desc' ? desc(col) : asc(col)
      );
    }
  }

  let query;
  if (parsedInput.columns && parsedInput.columns.length > 0) {
    const selectedCols: Record<string, any> = {
      id: portCostTable.id
    };

    parsedInput.columns.forEach((col) => {
      if (columnMap[col]) {
        selectedCols[col] = columnMap[col];
      }
    });

    query = db.select(selectedCols);
  } else {
    query = db.select();
  }

  const port_cost = await query
    .from(portCostTable)
    .where(whereClause)
    .orderBy(
      ...(orderByClause.length > 0 ? orderByClause : [asc(portCostTable.id)])
    )
    .limit(limit)
    .offset(offset);

  const [{ count: totalCount }] = await db
    .select({ count: count() })
    .from(portCostTable)
    .where(whereClause);

  return {
    port_cost,
    totalCount
  };
}
