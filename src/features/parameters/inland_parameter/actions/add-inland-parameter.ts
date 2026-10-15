'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { addInlandParameterSchema } from './add-inland-parameter-schema';
import db from '@/db';
import { inlandParametersTable } from '@/db/schema';
import { and, eq, gte, lte } from 'drizzle-orm';
import { ValidationError } from '@/lib/errors';
import { revalidatePath } from 'next/cache';

export const addInlandParameter = authActionClient
  .metadata({ actionName: 'addInlandParameter' })
  .inputSchema(addInlandParameterSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { inland_type, port, country, zip_code, value, cost_group } =
      parsedInput;

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
        .select({ id: inlandParametersTable.id })
        .from(inlandParametersTable)
        .where(
          and(
            eq(inlandParametersTable.inland_type, inland_type),
            eq(inlandParametersTable.port, port),
            eq(inlandParametersTable.country, country),
            gte(inlandParametersTable.start_date, todayStart.toISOString()),
            lte(inlandParametersTable.start_date, todayEnd.toISOString())
          )
        )
        .limit(1);

      if (alreadyCreatedToday.length > 0) {
        throw new ValidationError(
          'An inland parameter with the same parameters was already created today. Please edit the existing record instead.'
        );
      }

      const existing = await tx
        .select()
        .from(inlandParametersTable)
        .where(
          and(
            eq(inlandParametersTable.inland_type, inland_type),
            eq(inlandParametersTable.port, port),
            eq(inlandParametersTable.country, country),
            eq(inlandParametersTable.end_date, '2100-01-01T00:00:00Z') // solo el activo
          )
        )
        .limit(1);

      const activeRecord = existing[0];

      if (activeRecord) {
        await tx
          .update(inlandParametersTable)
          .set({
            end_date: yesterday.toISOString(),
            user: userEmail
          })
          .where(eq(inlandParametersTable.id, activeRecord.id));

        await tx.insert(inlandParametersTable).values({
          inland_type,
          port,
          country,
          zip_code,
          value,
          cost_group,
          start_date: today.toISOString(),
          end_date: '2100-01-01T00:00:00Z',
          user: userEmail
        });
      } else {
        await tx.insert(inlandParametersTable).values({
          inland_type,
          port,
          country,
          zip_code,
          value,
          cost_group,
          start_date: today.toISOString(),
          end_date: '2100-01-01T00:00:00Z',
          user: userEmail
        });
      }
    });

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

    revalidatePath('/dashboard/parameters/inland_parameters');

    return { message: 'Inland parameter updated successfully' };
  });
