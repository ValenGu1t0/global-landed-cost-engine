'use server';

import db from '@/db';
import { tariffParametersTable } from '@/db/schema';
import {
  getTariffParametersSchema,
  GetTariffParametersSchema
} from './get-tariff-parameters-schema';
import { ValidationError } from '@/lib/errors';
import { or, asc, desc, SQL, count, inArray, sql } from 'drizzle-orm';

export async function getTariffParameters(
  input: GetTariffParametersSchema
): Promise<{
  tariff_parameters: any[];
  totalCount: number;
}> {
  const result = getTariffParametersSchema.safeParse(input);
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
        sql`LOWER(${tariffParametersTable.origin_country}) LIKE ${s}`,
        sql`LOWER(${tariffParametersTable.destination_country}) LIKE ${s}`,
        sql`LOWER(${tariffParametersTable.cost_group}) LIKE ${s}`,
        sql`LOWER(${tariffParametersTable.user}) LIKE ${s}`
      )
    );
  }

  if (parsedInput.ids && parsedInput.ids.length > 0) {
    conditions.push(inArray(tariffParametersTable.id, parsedInput.ids));
  }

  const whereClause =
    conditions.length > 0
      ? sql`${sql.join(conditions, sql` AND `)}`
      : undefined;

  const columnMap: Record<string, any> = {
    id: tariffParametersTable.id,
    origin_country: tariffParametersTable.origin_country,
    destination_country: tariffParametersTable.destination_country,
    value: tariffParametersTable.value,
    cost_group: tariffParametersTable.cost_group,
    duty_dependent: tariffParametersTable.duty_dependent,
    user: tariffParametersTable.user,
    start_date: tariffParametersTable.start_date,
    end_date: tariffParametersTable.end_date
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
      id: tariffParametersTable.id
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

  const tariff_parameters = await query
    .from(tariffParametersTable)
    .where(whereClause)
    .orderBy(
      ...(orderByClause.length > 0
        ? orderByClause
        : [asc(tariffParametersTable.id)])
    )
    .limit(limit)
    .offset(offset);

  const [{ count: totalCount }] = await db
    .select({ count: count() })
    .from(tariffParametersTable)
    .where(whereClause);

  return {
    tariff_parameters,
    totalCount
  };
}
