'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { updateIncotermCostGroupSchema } from './update-incoterm_cost_group-schema';
import db from '@/db';
import { incotermCostGroupTable } from '@/db/schema';
import { and, eq, ne } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const updateIncotermCostGroup = authActionClient
  .metadata({ actionName: 'updateIncotermCostGroup' })
  .inputSchema(updateIncotermCostGroupSchema)
  .action(async ({ parsedInput }) => {
    const existing = await db
      .select({ id: incotermCostGroupTable.id })
      .from(incotermCostGroupTable)
      .where(
        and(
          eq(incotermCostGroupTable.cost_group, parsedInput.cost_group),
          eq(incotermCostGroupTable.vendor, parsedInput.vendor),
          eq(incotermCostGroupTable.country, parsedInput.country),
          eq(incotermCostGroupTable.incoterm, parsedInput.incoterm),
          ne(incotermCostGroupTable.id, parsedInput.id)
        )
      );

    if (existing.length > 0) {
      return {
        error:
          'Another Incoterm Cost Group with the same cost group, vendor, country and incoterm already exists.'
      };
    }

    await db
      .update(incotermCostGroupTable)
      .set({
        cost_group: parsedInput.cost_group,
        vendor: parsedInput.vendor,
        country: parsedInput.country,
        incoterm: parsedInput.incoterm
      })
      .where(eq(incotermCostGroupTable.id, parsedInput.id));

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
      message: 'Incoterm Cost Group updated successfully'
    };
  });
