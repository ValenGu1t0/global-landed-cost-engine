'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { updateDutiesCommercialAgreementSchema } from './update-duties-commercial-agreements-schema';
import db from '@/db';
import { dutiesCommercialAgreementsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const updateDutiesCommercialAgreement = authActionClient
  .metadata({ actionName: 'updateDutiesCommercialAgreement' })
  .inputSchema(updateDutiesCommercialAgreementSchema)
  .action(async ({ parsedInput }) => {
    const updateData: any = {
      cost_group: parsedInput.cost_group ?? null
    };

    await db
      .update(dutiesCommercialAgreementsTable)
      .set(updateData)
      .where(eq(dutiesCommercialAgreementsTable.id, parsedInput.id));

    //These are the scripts that perform product calculations that are directly related to the Commercial Agreements.
    import('@/lib/db/run-sql-file').then(async ({ runSqlFile }) => {
      try {
        await runSqlFile(
          'src/sql/Truncated Scripts/5_current_commercial_agreements_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/7_duties_calculations_truncate.sql'
        );
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

    revalidatePath('/dashboard/parameters/duties_commercial_agreements');

    return {
      message: 'Duties Commercial Agreement updated successfully'
    };
  });
