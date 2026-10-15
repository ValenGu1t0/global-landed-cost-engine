'use server';

import db from '@/db';
import { OtherParameter, otherParametersTable } from '@/db/schema';
import {
  GetOtherParametersSchema,
  getOtherParametersSchema
} from './get-other_parameters-schema';
import { ValidationError } from '@/lib/errors';
import { and, or, asc, desc, SQL, count, sql } from 'drizzle-orm';

export async function getOtherParameters(
  input: GetOtherParametersSchema
): Promise<{
  otherParameters: OtherParameter[];
  totalCount: number;
}> {
  const result = getOtherParametersSchema.safeParse(input);

  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error));
  }

  const parsedInput = result.data;
  const page = parsedInput.page || 1;
  const limit = parsedInput.limit || 10;
  const offset = (page - 1) * limit;

  const conditions = [];

  if (parsedInput.search) {
    const search = parsedInput.search.toLowerCase();
    const s = `%${search}%`;

    conditions.push(
      or(
        sql`LOWER(${otherParametersTable.parameter}) LIKE ${s}`,
        sql`LOWER(${otherParametersTable.cost_group}) LIKE ${s}`
      )
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const orderByClause: SQL[] = [];

  if (parsedInput.sortBy) {
    const columnMap: Record<string, any> = {
      id: otherParametersTable.parameter,
      cost_group: otherParametersTable.cost_group
    };

    const column = columnMap[parsedInput.sortBy];
    if (column) {
      const isDesc = parsedInput.sortDirection === 'desc';
      orderByClause.push(isDesc ? desc(column) : asc(column));
    }
  }

  const filteredOtherParameters = await db
    .select()
    .from(otherParametersTable)
    .where(and(whereClause))
    .orderBy(
      ...(orderByClause.length > 0
        ? orderByClause
        : [asc(otherParametersTable.parameter)])
    )
    .limit(limit)
    .offset(offset);

  const [{ count: totalCount }] = await db
    .select({ count: count() })
    .from(otherParametersTable)
    .where(and(whereClause));

  return {
    otherParameters: filteredOtherParameters as OtherParameter[],
    totalCount
  };
}
