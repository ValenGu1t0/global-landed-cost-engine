'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { deleteOtherParameterSchema } from './delete-other_parameter-schema';
import db from '@/db';
import { otherParametersTable } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { ValidationError } from '@/lib/errors';

export const deleteOtherParameter = authActionClient
  .metadata({ actionName: 'deleteOtherParameter' })
  .inputSchema(deleteOtherParameterSchema)
  .action(async ({ parsedInput, ctx }) => {
    const result = await db
      .delete(otherParametersTable)
      .where(and(eq(otherParametersTable.parameter, parsedInput.parameter)));

    if (result.rowCount == 0) {
      throw new ValidationError('Other Parameter was not deleted');
    }

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

    revalidatePath('/dashboard/parameters/other_parameter');

    return {
      message: 'Delete Other Parameter successful'
    };
  });
