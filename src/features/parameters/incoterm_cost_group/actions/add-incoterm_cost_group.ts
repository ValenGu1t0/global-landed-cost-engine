'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { addIncotermCostGroupSchema } from './add-incoterm_cost_group-schema';
import db from '@/db';
import { incotermCostGroupTable } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { createIncotermCostGroupData } from '../lib/incoterm_cost_group-factory';
import { and, eq } from 'drizzle-orm';

export const addIncotermCostGroup = authActionClient
  .metadata({ actionName: 'addIncotermCostGroup' })
  .inputSchema(addIncotermCostGroupSchema)
  .action(async ({ parsedInput, ctx }) => {
    // 1. Validación de PK lógica: vendor + country + incoterm + cost_group
    const existing = await db
      .select({ id: incotermCostGroupTable.id })
      .from(incotermCostGroupTable)
      .where(
        and(
          eq(incotermCostGroupTable.vendor, parsedInput.vendor),
          eq(incotermCostGroupTable.country, parsedInput.country),
          eq(incotermCostGroupTable.incoterm, parsedInput.incoterm),
          eq(incotermCostGroupTable.cost_group, parsedInput.cost_group)
        )
      );

    if (existing.length > 0) {
      return {
        error:
          'An Incoterm Cost Group with the same vendor, country, incoterm and cost group already exists.'
      };
    }

    const incotermCostGroupData = createIncotermCostGroupData(
      parsedInput,
      ctx.session.user.id
    );

    await db.insert(incotermCostGroupTable).values(incotermCostGroupData);

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
      message: 'Incoterm Cost Group added successfully.'
    };
  });
