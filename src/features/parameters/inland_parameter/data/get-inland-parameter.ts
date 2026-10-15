'use server';

import db from '@/db';
import { InlandParameter, inlandParametersTable } from '@/db/schema';
import {
  GetInlandParametersSchema,
  getInlandParametersSchema
} from './get-inland-parameter-schema';
import { ValidationError } from '@/lib/errors';
import { or, asc, desc, SQL, count, inArray, sql } from 'drizzle-orm';

export async function getInlandParameters(
  input: GetInlandParametersSchema
): Promise<{
  inland_parameters: InlandParameter[];
  totalCount: number;
}> {
  const result = getInlandParametersSchema.safeParse(input);
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
        sql`LOWER(${inlandParametersTable.inland_type}) LIKE ${s}`,
        sql`LOWER(${inlandParametersTable.port}) LIKE ${s}`,
        sql`LOWER(${inlandParametersTable.country}) LIKE ${s}`
      )
    );
  }

  if (parsedInput.ids && parsedInput.ids.length > 0) {
    conditions.push(inArray(inlandParametersTable.id, parsedInput.ids));
  }

  const whereClause =
    conditions.length > 0
      ? sql`${sql.join(conditions, sql` AND `)}`
      : undefined;

  const columnMap: Record<string, any> = {
    id: inlandParametersTable.id,
    inland_type: inlandParametersTable.inland_type,
    port: inlandParametersTable.port,
    country: inlandParametersTable.country,
    zip_code: inlandParametersTable.zip_code,
    value: inlandParametersTable.value,
    cost_group: inlandParametersTable.cost_group,
    user: inlandParametersTable.user,
    start_date: inlandParametersTable.start_date,
    end_date: inlandParametersTable.end_date
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
      id: inlandParametersTable.id
    };
    parsedInput.columns.forEach((col) => {
      if (columnMap[col]) selectedCols[col] = columnMap[col];
    });
    query = db.select(selectedCols);
  } else {
    query = db.select();
  }

  const inland_parameters = await query
    .from(inlandParametersTable)
    .where(whereClause)
    .orderBy(
      ...(orderByClause.length > 0
        ? orderByClause
        : [asc(inlandParametersTable.id)])
    )
    .limit(limit)
    .offset(offset);

  const [{ count: totalCount }] = await db
    .select({ count: count() })
    .from(inlandParametersTable)
    .where(whereClause);

  return {
    inland_parameters: inland_parameters as InlandParameter[],
    totalCount
  };
}
