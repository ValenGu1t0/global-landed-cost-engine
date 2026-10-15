'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { addHTSCodeSchema } from './add-hts-code-schema';
import db from '@/db';
import { htsCodesTable } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { createHTSCodeData } from '../lib/hts-factory';

export const addHTSCode = authActionClient
  .metadata({ actionName: 'addHTSCode' })
  .inputSchema(addHTSCodeSchema)
  .action(async ({ parsedInput, ctx }) => {
    const htsData = createHTSCodeData(parsedInput);

    await db.insert(htsCodesTable).values(htsData);

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
      message: 'HTS Code added successfully.'
    };
  });
