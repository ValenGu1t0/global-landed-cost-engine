'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { addOtherParameterSchema } from './add-other_parameter-schema';
import db from '@/db';
import { otherParametersTable } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { createOtherParameterData } from '../lib/other_parameter-factory';

export const addOtherParameter = authActionClient
  .metadata({ actionName: 'addOtherParameter' })
  .inputSchema(addOtherParameterSchema)
  .action(async ({ parsedInput, ctx }) => {
    const otherParameterData = createOtherParameterData(parsedInput);

    await db.insert(otherParametersTable).values(otherParameterData);

    //These are the scripts that perform product calculations that are directly related to the Other Parameters.
    import('@/lib/db/run-sql-file').then(async ({ runSqlFile }) => {
      try {
        await runSqlFile(
          'src/sql/Truncated Scripts/1_simple_parameters_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/7_duties_calculations_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/8_tariff_calculations_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/11_40HC_calculations_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/12_45HC_calculations_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/13_40STD_calculations_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/14_20STD_calculations_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/15_53FT_calculations_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/17_ground_logistic_per_container_calculations_truncate.sql'
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

    revalidatePath('/dashboard/parameters/other_parameters');

    return {
      message: 'Other Parameter Code added successfully.'
    };
  });
