'use server';

import db from '@/db';
import { tariffHTSExceptionsTable } from '@/db/schema';
import {
  getTariffHTSExceptionsSchema,
  GetTariffHTSExceptionsSchema
} from './get-tariff-hts-exception-schema';
import { ValidationError } from '@/lib/errors';
import { or, asc, desc, SQL, count, inArray, sql } from 'drizzle-orm';

export async function getTariffHTSExceptions(
  input: GetTariffHTSExceptionsSchema
): Promise<{
  tariff_hts_exceptions: any[];
  totalCount: number;
}> {
  const result = getTariffHTSExceptionsSchema.safeParse(input);
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
        sql`LOWER(${tariffHTSExceptionsTable.hts_code}) LIKE ${s}`,
        sql`LOWER(${tariffHTSExceptionsTable.origin_country}) LIKE ${s}`,
        sql`LOWER(${tariffHTSExceptionsTable.destination_country}) LIKE ${s}`,
        sql`LOWER(${tariffHTSExceptionsTable.cost_group}) LIKE ${s}`,
        sql`LOWER(${tariffHTSExceptionsTable.user}) LIKE ${s}`
      )
    );
  }

  if (parsedInput.ids && parsedInput.ids.length > 0) {
    conditions.push(inArray(tariffHTSExceptionsTable.id, parsedInput.ids));
  }

  const whereClause =
    conditions.length > 0
      ? sql`${sql.join(conditions, sql` AND `)}`
      : undefined;

  const columnMap: Record<string, any> = {
    id: tariffHTSExceptionsTable.id,
    hts_code: tariffHTSExceptionsTable.hts_code,
    origin_country: tariffHTSExceptionsTable.origin_country,
    destination_country: tariffHTSExceptionsTable.destination_country,
    special_tariff_value: tariffHTSExceptionsTable.special_tariff_value,
    cost_group: tariffHTSExceptionsTable.cost_group,
    user: tariffHTSExceptionsTable.user,
    start_date: tariffHTSExceptionsTable.start_date,
    end_date: tariffHTSExceptionsTable.end_date
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
      id: tariffHTSExceptionsTable.id
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

  const tariff_hts_exceptions = await query
    .from(tariffHTSExceptionsTable)
    .where(whereClause)
    .orderBy(
      ...(orderByClause.length > 0
        ? orderByClause
        : [asc(tariffHTSExceptionsTable.id)])
    )
    .limit(limit)
    .offset(offset);

  const [{ count: totalCount }] = await db
    .select({ count: count() })
    .from(tariffHTSExceptionsTable)
    .where(whereClause);

  return {
    tariff_hts_exceptions,
    totalCount
  };
}
