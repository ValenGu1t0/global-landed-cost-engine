'use server';

import db from '@/db';
import { dutiesCommercialAgreementsTable } from '@/db/schema';
import {
  getDutiesCommercialAgreementsSchema,
  GetDutiesCommercialAgreementsSchema
} from './get-duties-commercial-agreements-schema';
import { ValidationError } from '@/lib/errors';
import { or, asc, desc, SQL, count, inArray, sql } from 'drizzle-orm';

export async function getDutiesCommercialAgreements(
  input: GetDutiesCommercialAgreementsSchema
): Promise<{
  duties: any[];
  totalCount: number;
}> {
  const result = getDutiesCommercialAgreementsSchema.safeParse(input);
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
        sql`LOWER(${dutiesCommercialAgreementsTable.origin_country}) LIKE ${s}`,
        sql`LOWER(${dutiesCommercialAgreementsTable.destination_country}) LIKE ${s}`,
        sql`LOWER(${dutiesCommercialAgreementsTable.raw_material}) LIKE ${s}`,
        sql`LOWER(${dutiesCommercialAgreementsTable.cost_group}) LIKE ${s}`
      )
    );
  }

  if (parsedInput.ids && parsedInput.ids.length > 0) {
    conditions.push(
      inArray(dutiesCommercialAgreementsTable.id, parsedInput.ids)
    );
  }

  const whereClause =
    conditions.length > 0
      ? sql`${sql.join(conditions, sql` AND `)}`
      : undefined;

  const columnMap: Record<string, any> = {
    id: dutiesCommercialAgreementsTable.id,
    origin_country: dutiesCommercialAgreementsTable.origin_country,
    destination_country: dutiesCommercialAgreementsTable.destination_country,
    raw_material: dutiesCommercialAgreementsTable.raw_material,
    cost_group: dutiesCommercialAgreementsTable.cost_group,
    start_date: dutiesCommercialAgreementsTable.start_date,
    end_date: dutiesCommercialAgreementsTable.end_date,
    user: dutiesCommercialAgreementsTable.user
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
      id: dutiesCommercialAgreementsTable.id
    };
    parsedInput.columns.forEach((col) => {
      if (columnMap[col]) selectedCols[col] = columnMap[col];
    });
    query = db.select(selectedCols);
  } else {
    query = db.select();
  }

  const duties = await query
    .from(dutiesCommercialAgreementsTable)
    .where(whereClause)
    .orderBy(
      ...(orderByClause.length > 0
        ? orderByClause
        : [asc(dutiesCommercialAgreementsTable.id)])
    )
    .limit(limit)
    .offset(offset);

  const [{ count: totalCount }] = await db
    .select({ count: count() })
    .from(dutiesCommercialAgreementsTable)
    .where(whereClause);

  return {
    duties,
    totalCount
  };
}
