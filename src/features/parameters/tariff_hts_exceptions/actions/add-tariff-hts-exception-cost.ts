'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { addTariffHTSExceptionSchema } from './add-tariff-hts-exception-schema';
import db from '@/db';
import { tariffHTSExceptionsTable } from '@/db/schema';
import { and, eq, gte, lte } from 'drizzle-orm';
import { ValidationError } from '@/lib/errors';
import { revalidatePath } from 'next/cache';

export const addTariffHTSException = authActionClient
  .metadata({ actionName: 'addTariffHTSException' })
  .inputSchema(addTariffHTSExceptionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const {
      hts_code,
      origin_country,
      destination_country,
      special_tariff_value,
      cost_group
    } = parsedInput;

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
      // Fun para evitar que se creen mismos parametros en el mismo dia
      const alreadyCreatedToday = await tx
        .select({ id: tariffHTSExceptionsTable.id })
        .from(tariffHTSExceptionsTable)
        .where(
          and(
            eq(tariffHTSExceptionsTable.hts_code, hts_code),
            eq(tariffHTSExceptionsTable.origin_country, origin_country),
            eq(
              tariffHTSExceptionsTable.destination_country,
              destination_country
            ),
            gte(tariffHTSExceptionsTable.start_date, todayStart.toISOString()),
            lte(tariffHTSExceptionsTable.start_date, todayEnd.toISOString())
          )
        )
        .limit(1);

      if (alreadyCreatedToday.length > 0) {
        throw new ValidationError(
          'A tariff HTS exception with the same parameters was already created today. Please edit the existing record instead.'
        );
      }

      const existingActive = await tx
        .select()
        .from(tariffHTSExceptionsTable)
        .where(
          and(
            eq(tariffHTSExceptionsTable.hts_code, hts_code),
            eq(tariffHTSExceptionsTable.origin_country, origin_country),
            eq(
              tariffHTSExceptionsTable.destination_country,
              destination_country
            ),
            eq(tariffHTSExceptionsTable.end_date, '2100-01-01T00:00:00Z')
          )
        )
        .limit(1);

      const activeRecord = existingActive[0];

      // Si existen coincidencias, deprecamos el viejo
      if (activeRecord) {
        await tx
          .update(tariffHTSExceptionsTable)
          .set({
            end_date: yesterday.toISOString(),
            user: userEmail
          })
          .where(eq(tariffHTSExceptionsTable.id, activeRecord.id));
      }

      // Insertamos la nueva version
      await tx.insert(tariffHTSExceptionsTable).values({
        hts_code,
        origin_country,
        destination_country,
        special_tariff_value,
        cost_group,
        start_date: today.toISOString(),
        end_date: '2100-01-01T00:00:00Z',
        user: userEmail
      });
    });

    // These are the scripts required for product calculations directly related to Tariffs
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

    revalidatePath('/dashboard/parameters/tariff_hts_exceptions');

    return { message: 'HTS Exception added successfully' };
  });
