import { NewVendorPort } from '@/db/schema';
import { AddVendorPortSchema } from '../actions/add-vendor_port-schema';

export function createVendorPortData(
  input: AddVendorPortSchema,
  userId: string
): NewVendorPort {
  return {
    user_id: userId,
    vendor: input.vendor,
    country: input.country,
    port: input.port,
    main_port: input.main_port
  };
}
