'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { deleteVendorPortSchema } from './delete-vendor_port-schema';
import db from '@/db';
import { vendorPortsTable } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { ValidationError } from '@/lib/errors';

export const deleteVendorPort = authActionClient
  .metadata({ actionName: 'deleteVendorPort' })
  .inputSchema(deleteVendorPortSchema)
  .action(async ({ parsedInput, ctx }) => {
    const result = await db
      .delete(vendorPortsTable)
      .where(and(eq(vendorPortsTable.id, parsedInput.id)));

    if (result.rowCount == 0) {
      throw new ValidationError('Vendor Port was not deleted');
    }

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
      message: 'Delete Vendor Port successful'
    };
  });
