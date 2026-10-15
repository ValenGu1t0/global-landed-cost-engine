'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { updateTariffHTSExceptionSchema } from './update-tariff-hts-exception-schema';
import db from '@/db';
import { tariffHTSExceptionsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const updateTariffHTSException = authActionClient
  .metadata({ actionName: 'updateTariffHTSException' })
  .inputSchema(updateTariffHTSExceptionSchema)
  .action(async ({ parsedInput }) => {
    const updateData: any = {
      special_tariff_value: parsedInput.special_tariff_value,
      cost_group: parsedInput.cost_group,
      user: parsedInput.user
    };

    await db
      .update(tariffHTSExceptionsTable)
      .set(updateData)
      .where(eq(tariffHTSExceptionsTable.id, parsedInput.id));

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

    revalidatePath('/dashboard/parameters/tariff_hts_exceptions');

    return {
      message: 'Tariff HTS Exception updated successfully'
    };
  });
