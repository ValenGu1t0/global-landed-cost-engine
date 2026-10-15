'use server';

import db from '@/db';
import { vendorPortsTable } from '@/db/schema';
import {
  GetVendorPortSchema,
  getVendorPortSchema
} from './get-vendor_port-id-schema';
import { VendorPort } from '@/db/schema';
import { ValidationError } from '@/lib/errors';
import { eq } from 'drizzle-orm';

export async function getVendorPortId(
  input: GetVendorPortSchema
): Promise<VendorPort | null> {
  const result = getVendorPortSchema.safeParse(input);

  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error));
  }

  const parsedInput = result.data;

  const vendorPort = await db
    .select()
    .from(vendorPortsTable)
    .where(eq(vendorPortsTable.id, parsedInput.id))
    .limit(1);

  return (vendorPort[0] as VendorPort) || null;
}
