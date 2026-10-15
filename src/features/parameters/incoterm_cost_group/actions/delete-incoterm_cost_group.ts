'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { deleteIncotermCostGroupSchema } from './delete-incoterm_cost_group-schema';
import db from '@/db';
import { incotermCostGroupTable } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { ValidationError } from '@/lib/errors';

export const deleteIncotermCostGroup = authActionClient
  .metadata({ actionName: 'delete Incoterm Cost Group' })
  .inputSchema(deleteIncotermCostGroupSchema)
  .action(async ({ parsedInput, ctx }) => {
    const result = await db
      .delete(incotermCostGroupTable)
      .where(and(eq(incotermCostGroupTable.id, parsedInput.id)));

    if (result.rowCount == 0) {
      throw new ValidationError('Incoterm Cost Group was not deleted');
    }

    //These are the scripts required for product calculations directly related to Incoterm Cost Group parameters
    import('@/lib/db/run-sql-file').then(async ({ runSqlFile }) => {
      try {
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

    revalidatePath('/dashboard/parameters/incoterm_cost_group');

    return {
      message: 'Delete Incoterm Cost Group successful'
    };
  });
