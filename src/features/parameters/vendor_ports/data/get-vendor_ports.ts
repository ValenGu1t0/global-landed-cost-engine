'use server';

import db from '@/db';
import { vendorPortsTable } from '@/db/schema';
import {
  GetVendorPortsSchema,
  getVendorPortsSchema
} from './get-vendor_ports-schema';
import { VendorPort } from '@/db/schema';
import { ValidationError } from '@/lib/errors';
import { and, or, asc, desc, SQL, count, sql } from 'drizzle-orm';

export async function getVendorPorts(input: GetVendorPortsSchema): Promise<{
  vendorPorts: VendorPort[];
  totalCount: number;
}> {
  const result = getVendorPortsSchema.safeParse(input);

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
        sql`LOWER(${vendorPortsTable.vendor}) LIKE ${s}`,
        sql`LOWER(${vendorPortsTable.country}) LIKE ${s}`,
        sql`LOWER(${vendorPortsTable.port}) LIKE ${s}`
      )
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const orderByClause: SQL[] = [];

  if (parsedInput.sortBy) {
    const columnMap: Record<string, any> = {
      id: vendorPortsTable.id,
      vendor: vendorPortsTable.vendor,
      country: vendorPortsTable.country
    };

    const column = columnMap[parsedInput.sortBy];
    if (column) {
      const isDesc = parsedInput.sortDirection === 'desc';
      orderByClause.push(isDesc ? desc(column) : asc(column));
    }
  }

  const filteredVendorPorts = await db
    .select()
    .from(vendorPortsTable)
    .where(and(whereClause))
    .orderBy(
      ...(orderByClause.length > 0 ? orderByClause : [asc(vendorPortsTable.id)])
    )
    .limit(limit)
    .offset(offset);

  const [{ count: totalCount }] = await db
    .select({ count: count() })
    .from(vendorPortsTable)
    .where(and(whereClause));

  return {
    vendorPorts: filteredVendorPorts as VendorPort[],
    totalCount
  };
}
