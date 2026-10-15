'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { addPortCostSchema } from './add-port-cost-schema';
import db from '@/db';
import { portCostTable } from '@/db/schema';
import { and, eq, gte, lte } from 'drizzle-orm';
import { ValidationError } from '@/lib/errors';
import { revalidatePath } from 'next/cache';

export const addPortCost = authActionClient
  .metadata({ actionName: 'addPortCost' })
  .inputSchema(addPortCostSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { logistic_cost, value, cost_group } = parsedInput;

    const userEmail = ctx.session?.user?.email;
    if (!userEmail) {
      throw new ValidationError('User not authenticated');
    }

    const today = new Date();

    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    await db.transaction(async (tx) => {
      const alreadyCreatedToday = await tx
        .select({ id: portCostTable.id })
        .from(portCostTable)
        .where(
          and(
            eq(portCostTable.logistic_cost, logistic_cost),
            gte(portCostTable.start_date, todayStart.toISOString()),
            lte(portCostTable.start_date, todayEnd.toISOString())
          )
        )
        .limit(1);

      if (alreadyCreatedToday.length > 0) {
        throw new ValidationError(
          'A port cost with the same parameters was already created today. Please edit the existing record instead.'
        );
      }

      const existing = await tx
        .select()
        .from(portCostTable)
        .where(
          and(
            eq(portCostTable.logistic_cost, logistic_cost),
            eq(portCostTable.end_date, '2100-01-01T00:00:00Z')
          )
        )
        .limit(1);

      const activeRecord = existing[0];

      if (activeRecord) {
        await tx
          .update(portCostTable)
          .set({
            end_date: yesterday.toISOString(),
            user: userEmail
          })
          .where(eq(portCostTable.id, activeRecord.id));

        await tx.insert(portCostTable).values({
          logistic_cost,
          value,
          cost_group,
          start_date: today.toISOString(),
          end_date: '2100-01-01T00:00:00Z',
          user: userEmail
        });
      } else {
        await tx.insert(portCostTable).values({
          logistic_cost,
          value,
          cost_group,
          start_date: today.toISOString(),
          end_date: '2100-01-01T00:00:00Z',
          user: userEmail
        });
      }
    });

    //These are the scripts that perform product calculations that are directly related to the Port Costs.
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

    revalidatePath('/dashboard/parameters/port_cost');

    return { message: 'Port cost added successfully' };
  });
