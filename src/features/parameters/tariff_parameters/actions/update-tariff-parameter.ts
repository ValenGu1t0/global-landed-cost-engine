'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { updateTariffParameterSchema } from './update-tariff-parameter-schema';
import db from '@/db';
import { tariffParametersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const updateTariffParameter = authActionClient
  .metadata({ actionName: 'updateTariffParameter' })
  .inputSchema(updateTariffParameterSchema)
  .action(async ({ parsedInput }) => {
    const updateData: any = {
      origin_country: parsedInput.origin_country,
      destination_country: parsedInput.destination_country,
      value: parsedInput.value,
      cost_group: parsedInput.cost_group,
      duty_dependent: parsedInput.duty_dependent,
      user: parsedInput.user
    };

    await db
      .update(tariffParametersTable)
      .set(updateData)
      .where(eq(tariffParametersTable.id, parsedInput.id));

    //These are the scripts required for product calculations directly related to Tariffs
    import('@/lib/db/run-sql-file').then(async ({ runSqlFile }) => {
      try {
        await runSqlFile('src/sql/Truncated Scripts/6_tariffs_truncate.sql');
        await runSqlFile(
          'src/sql/Truncated Scripts/8_tariff_calculations_truncate.sql'
        );
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

    revalidatePath('/dashboard/parameters/tariff_parameters');

    return {
      message: 'Tariff Parameter updated successfully'
    };
  });
