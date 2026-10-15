'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { addTariffParametersSchema } from './add-tariff-parameter-schema';
import db from '@/db';
import { tariffParametersTable } from '@/db/schema';
import { and, eq, gte, lte } from 'drizzle-orm';
import { ValidationError } from '@/lib/errors';
import { revalidatePath } from 'next/cache';

export const addTariffParameters = authActionClient
  .metadata({ actionName: 'addTariffParameters' })
  .inputSchema(addTariffParametersSchema)
  .action(async ({ parsedInput, ctx }) => {
    const {
      origin_country,
      destination_country,
      value,
      cost_group,
      duty_dependent
    } = parsedInput;

    const userEmail = ctx.session?.user?.email;
    if (!userEmail) throw new ValidationError('User not authenticated');

    const today = new Date();

    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    await db.transaction(async (tx) => {
      const alreadyCreatedToday = await tx
        .select({ id: tariffParametersTable.id })
        .from(tariffParametersTable)
        .where(
          and(
            eq(tariffParametersTable.origin_country, origin_country),
            eq(tariffParametersTable.destination_country, destination_country),
            gte(tariffParametersTable.start_date, todayStart.toISOString()),
            lte(tariffParametersTable.start_date, todayEnd.toISOString())
          )
        )
        .limit(1);

      if (alreadyCreatedToday.length > 0) {
        throw new ValidationError(
          'A tariff parameter with the same parameters was already created today. Please edit the existing record instead.'
        );
      }

      const existing = await tx
        .select()
        .from(tariffParametersTable)
        .where(
          and(
            eq(tariffParametersTable.origin_country, origin_country),
            eq(tariffParametersTable.destination_country, destination_country),
            eq(tariffParametersTable.end_date, '2100-01-01T00:00:00Z')
          )
        )
        .limit(1);

      const activeRecord = existing[0];

      if (activeRecord) {
        await tx
          .update(tariffParametersTable)
          .set({
            end_date: yesterday.toISOString(),
            user: userEmail
          })
          .where(eq(tariffParametersTable.id, activeRecord.id));

        await tx.insert(tariffParametersTable).values({
          origin_country,
          destination_country,
          value,
          cost_group,
          duty_dependent,
          start_date: today.toISOString(),
          end_date: '2100-01-01T00:00:00Z',
          user: userEmail
        });
      } else {
        await tx.insert(tariffParametersTable).values({
          origin_country,
          destination_country,
          value,
          cost_group,
          duty_dependent,
          start_date: today.toISOString(),
          end_date: '2100-01-01T00:00:00Z',
          user: userEmail
        });
      }
    });

    //These are the scripts required for product calculations directly related to Tariffs
    import('@/lib/db/run-sql-file').then(async ({ runSqlFile }) => {
      try {
        await runSqlFile('src/sql/Truncated Scripts/6_tariffs_truncate.sql');
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

    revalidatePath('/dashboard/parameters/tariff_parameters');

    return { message: 'Tariff parameters added successfully' };
  });
