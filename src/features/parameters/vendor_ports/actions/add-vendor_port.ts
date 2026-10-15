'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { addVendorPortSchema } from './add-vendor_port-schema';
import db from '@/db';
import { vendorPortsTable } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { createVendorPortData } from '../lib/vendor_ports-factory';
import { and, eq } from 'drizzle-orm';

export const addVendorPort = authActionClient
  .metadata({ actionName: 'addVendorPort' })
  .inputSchema(addVendorPortSchema)
  .action(async ({ parsedInput, ctx }) => {
    const existing = await db
      .select({ id: vendorPortsTable.id })
      .from(vendorPortsTable)
      .where(
        and(
          eq(vendorPortsTable.vendor, parsedInput.vendor),
          eq(vendorPortsTable.country, parsedInput.country),
          eq(vendorPortsTable.port, parsedInput.port)
        )
      );
    if (existing.length > 0) {
      return {
        error:
          'A Vendor Port with this vendor, country and port already exists.'
      };
    }
    // 2. Crear datos reales con user_id incluido
    const vendor_port_data = createVendorPortData(
      parsedInput,
      ctx.session.user.id
    );
    // 3. Insert
    await db.insert(vendorPortsTable).values(vendor_port_data);

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
      message: 'Vendor Port added successfully.'
    };
  });
