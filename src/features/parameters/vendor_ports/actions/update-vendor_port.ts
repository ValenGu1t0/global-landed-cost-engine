'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { updateVendorPortSchema } from './update-vendor_port-schema';
import db from '@/db';
import { vendorPortsTable } from '@/db/schema';
import { eq, and, ne } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const updateVendorPort = authActionClient
  .metadata({ actionName: 'updateVendorPort' })
  .inputSchema(updateVendorPortSchema)
  .action(async ({ parsedInput }) => {
    // 1. Check si existe otro registro con misma combinación
    const existing = await db
      .select({ id: vendorPortsTable.id })
      .from(vendorPortsTable)
      .where(
        and(
          eq(vendorPortsTable.vendor, parsedInput.vendor),
          eq(vendorPortsTable.country, parsedInput.country),
          eq(vendorPortsTable.port, parsedInput.port),
          ne(vendorPortsTable.id, parsedInput.id) // el que estoy editando NO cuenta
        )
      );

    if (existing.length > 0) {
      return {
        error:
          'Another Vendor Port with the same vendor, country and port already exists'
      };
    }

    // 2. Update normal
    await db
      .update(vendorPortsTable)
      .set({
        vendor: parsedInput.vendor,
        country: parsedInput.country,
        port: parsedInput.port,
        main_port: parsedInput.main_port
      })
      .where(eq(vendorPortsTable.id, parsedInput.id));

    //These are the scripts that perform product calculations that are directly related to the Vendor Ports.
    import('@/lib/db/run-sql-file').then(async ({ runSqlFile }) => {
      try {
        await runSqlFile('src/sql/Truncated Scripts/2_main_port_truncate.sql');
        await runSqlFile(
          'src/sql/Truncated Scripts/18_ocean_logistic_per_container_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/19_final_logistic_costs_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/20_final_landed_costs_calculations_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/21_kits_calculations_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/22_comission_calculations_truncate.sql'
        );
        await runSqlFile('src/sql/postgress_public/2_products_postgres.sql');
        await runSqlFile('src/sql/postgress_public/3_kits_postgres.sql');
      } catch (err) {
        console.error('SQL execution failed:', err);
      }
    });

    revalidatePath('/dashboard/parameters/vendor_ports');

    return {
      message: 'Vendor Port updated successfully'
    };
  });
