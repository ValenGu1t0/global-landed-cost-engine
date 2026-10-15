'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { updateOceanFreightSchema } from './update-ocean-freight-schema';
import db from '@/db';
import { oceanFreightTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const updateOceanFreight = authActionClient
  .metadata({ actionName: 'updateOceanFreight' })
  .inputSchema(updateOceanFreightSchema)
  .action(async ({ parsedInput }) => {
    const updateData: any = {
      origin_port: parsedInput.origin_port,
      origin_country: parsedInput.origin_country,
      destination_port: parsedInput.destination_port,
      destination_country: parsedInput.destination_country,
      container_type: parsedInput.container_type,

      value: parsedInput.value,
      cost_group: parsedInput.cost_group
    };

    await db
      .update(oceanFreightTable)
      .set(updateData)
      .where(eq(oceanFreightTable.id, parsedInput.id));

    //These are the scripts required for product calculations directly related to Ocean Freight
    import('@/lib/db/run-sql-file').then(async ({ runSqlFile }) => {
      try {
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

    revalidatePath('/dashboard/parameters/ocean_freight');

    return {
      message: 'Ocean Freight updated successfully'
    };
  });
