'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { addDutiesCommercialAgreementSchema } from './add-duties-commercial-agreements-schema';
import db from '@/db';
import { dutiesCommercialAgreementsTable } from '@/db/schema';
import { and, eq, gte, lte } from 'drizzle-orm';
import { ValidationError } from '@/lib/errors';
import { revalidatePath } from 'next/cache';
import { END_OF_TIME } from '@/constants/data';

export const addDutiesCommercialAgreement = authActionClient
  .metadata({ actionName: 'addDutiesCommercialAgreement' })
  .inputSchema(addDutiesCommercialAgreementSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { origin_country, destination_country, raw_material, cost_group } =
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
        .select({ id: dutiesCommercialAgreementsTable.id })
        .from(dutiesCommercialAgreementsTable)
        .where(
          and(
            eq(dutiesCommercialAgreementsTable.origin_country, origin_country),
            eq(
              dutiesCommercialAgreementsTable.destination_country,
              destination_country
            ),
            eq(dutiesCommercialAgreementsTable.raw_material, raw_material),
            gte(
              dutiesCommercialAgreementsTable.start_date,
              todayStart.toISOString()
            ),
            lte(
              dutiesCommercialAgreementsTable.start_date,
              todayEnd.toISOString()
            )
          )
        )
        .limit(1);

      if (alreadyCreatedToday.length > 0) {
        throw new ValidationError(
          'A commercial agreement with the same parameters was already created today. Please edit the existing record instead.'
        );
      }

      const existingActive = await tx
        .select()
        .from(dutiesCommercialAgreementsTable)
        .where(
          and(
            eq(dutiesCommercialAgreementsTable.origin_country, origin_country),
            eq(
              dutiesCommercialAgreementsTable.destination_country,
              destination_country
            ),
            eq(dutiesCommercialAgreementsTable.raw_material, raw_material),
            eq(dutiesCommercialAgreementsTable.end_date, END_OF_TIME)
          )
        )
        .limit(1);

      const activeRecord = existingActive[0];

      if (activeRecord) {
        await tx
          .update(dutiesCommercialAgreementsTable)
          .set({
            end_date: yesterday.toISOString(),
            user: userEmail
          })
          .where(eq(dutiesCommercialAgreementsTable.id, activeRecord.id));
      }

      await tx.insert(dutiesCommercialAgreementsTable).values({
        origin_country,
        destination_country,
        raw_material,
        cost_group,
        start_date: today.toISOString(),
        end_date: END_OF_TIME,
        user: userEmail
      });
    });

    // These are the scripts required for product calculations directly related to Tariffs
    import('@/lib/db/run-sql-file').then(async ({ runSqlFile }) => {
      try {
        await runSqlFile(
          'src/sql/Truncated Scripts/5_current_commercial_agreements_truncate.sql'
        );
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

    revalidatePath('/dashboard/parameters/duties_commercial_agreements');

    return { message: 'Duties Commercial Agreement updated successfully' };
  });
