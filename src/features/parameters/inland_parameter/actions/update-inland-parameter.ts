'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { updateInlandParameterSchema } from './update-inland-parameter-schema';
import db from '@/db';
import { inlandParametersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const updateInlandParameter = authActionClient
  .metadata({ actionName: 'updateInlandParameter' })
  .inputSchema(updateInlandParameterSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...rest } = parsedInput;

    if (!id) {
      throw new Error('Missing inland parameter ID');
    }

    await db
      .update(inlandParametersTable)
      .set(rest)
      .where(eq(inlandParametersTable.id, id));

    //These are the scripts required for product calculations directly related to Inalnd Parameters
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

    revalidatePath('/dashboard/parameters/inland_parameter');

    return {
      message: 'Inland Parameter updated successfully',
      id: parsedInput.id
    };
  });
