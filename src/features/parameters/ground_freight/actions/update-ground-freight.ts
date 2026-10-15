'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { updateGroundFreightSchema } from './update-ground-freight-schema';
import db from '@/db';
import { groundFreightTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const updateGroundFreight = authActionClient
  .metadata({ actionName: 'updateGroundFreight' })
  .inputSchema(updateGroundFreightSchema)
  .action(async ({ parsedInput }) => {
    const updateData: any = {
      vendor: parsedInput.vendor,
      factory_name: parsedInput.factory_name,
      origin_country: parsedInput.origin_country,
      destination_country: parsedInput.destination_country,
      destination_warehouse: parsedInput.destination_warehouse,
      container_type: parsedInput.container_type,

      cost_detail: parsedInput.cost_detail,
      value: parsedInput.value,
      cost_group: parsedInput.cost_group
    };

    await db
      .update(groundFreightTable)
      .set(updateData)
      .where(eq(groundFreightTable.id, parsedInput.id));

    //These are the scripts required for product calculations directly related to Ground Freight
    import('@/lib/db/run-sql-file').then(async ({ runSqlFile }) => {
      try {
        await runSqlFile(
          'src/sql/Truncated Scripts/16_current_ground_freights_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/17_ground_logistic_per_container_calculations_truncate.sql'
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

    revalidatePath('/dashboard/parameters/ground_freight');

    return {
      message: 'Ground Freight updated successfully'
    };
  });
