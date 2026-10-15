'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { updateHTSCodeSchema } from './update-hts-code-schema';
import db from '@/db';
import { htsCodesTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const updateHTSCode = authActionClient
  .metadata({ actionName: 'updateHTSCode' })
  .inputSchema(updateHTSCodeSchema)
  .action(async ({ parsedInput }) => {
    await db
      .update(htsCodesTable)
      .set({
        // no se puede modificar el hts
        hts_category: parsedInput.hts_category,
        min_value: parsedInput.min_value,
        max_value: parsedInput.max_value,
        type: parsedInput.type,
        duty: parsedInput.duty,
        cost_group: parsedInput.cost_group,
        hts_product_subtype: parsedInput.hts_product_subtype,
        fixed_duty_per_piece: parsedInput.fixed_duty_per_piece,
        notes: parsedInput.notes
      })
      .where(eq(htsCodesTable.hts_code, parsedInput.hts_code));

    //These are the scripts that perform product calculations that are directly related to the HTS Codes.
    import('@/lib/db/run-sql-file').then(async ({ runSqlFile }) => {
      try {
        await runSqlFile('src/sql/Truncated Scripts/4_hts_truncate.sql');
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

    revalidatePath('/dashboard/parameters/HTS');

    return {
      message: 'HTS Code updated successfully'
    };
  });
