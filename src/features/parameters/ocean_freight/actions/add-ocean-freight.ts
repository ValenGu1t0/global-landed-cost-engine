'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { addOceanFreightSchema } from './add-ocean-freight-schema';
import db from '@/db';
import { oceanFreightTable } from '@/db/schema';
import { and, eq, gte, lte } from 'drizzle-orm';
import { ValidationError } from '@/lib/errors';
import { revalidatePath } from 'next/cache';

export const addOceanFreight = authActionClient
  .metadata({ actionName: 'addOceanFreight' })
  .inputSchema(addOceanFreightSchema)
  .action(async ({ parsedInput, ctx }) => {
    const {
      origin_port,
      origin_country,
      destination_port,
      destination_country,
      container_type,
      value,
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
      const alreadyCreatedToday = await tx
        .select({ id: oceanFreightTable.id })
        .from(oceanFreightTable)
        .where(
          and(
            eq(oceanFreightTable.origin_port, origin_port),
            eq(oceanFreightTable.origin_country, origin_country),
            eq(oceanFreightTable.destination_port, destination_port),
            eq(oceanFreightTable.destination_country, destination_country),
            eq(oceanFreightTable.container_type, container_type),
            gte(oceanFreightTable.start_date, todayStart.toISOString()),
            lte(oceanFreightTable.start_date, todayEnd.toISOString())
          )
        )
        .limit(1);

      if (alreadyCreatedToday.length > 0) {
        throw new ValidationError(
          'An ocean freight with the same parameters was already created today. Please edit the existing record instead.'
        );
      }

      const existing = await tx
        .select()
        .from(oceanFreightTable)
        .where(
          and(
            eq(oceanFreightTable.origin_port, origin_port),
            eq(oceanFreightTable.origin_country, origin_country),
            eq(oceanFreightTable.destination_port, destination_port),
            eq(oceanFreightTable.destination_country, destination_country),
            eq(oceanFreightTable.container_type, container_type),
            eq(oceanFreightTable.end_date, '2100-01-01T00:00:00Z')
          )
        )
        .limit(1);

      const activeRecord = existing[0];

      if (activeRecord) {
        // 1) Cerrar registro anterior
        await tx
          .update(oceanFreightTable)
          .set({
            end_date: yesterday.toISOString(),
            user: userEmail
          })
          .where(eq(oceanFreightTable.id, activeRecord.id));

        // 2) Insertar nuevo registro actualizado
        await tx.insert(oceanFreightTable).values({
          origin_port,
          origin_country,
          destination_port,
          destination_country,
          container_type,
          value,
          cost_group,
          start_date: today.toISOString(),
          end_date: '2100-01-01T00:00:00Z',
          user: userEmail
        });
      } else {
        // Si no existe uno activo -> insertar uno nuevo directamente
        await tx.insert(oceanFreightTable).values({
          origin_port,
          origin_country,
          destination_port,
          destination_country,
          container_type,
          value,
          cost_group,
          start_date: today.toISOString(),
          end_date: '2100-01-01T00:00:00Z',
          user: userEmail
        });
      }
    });

    //These are the scripts required for product calculations directly related to Ocean Freight
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

    revalidatePath('/dashboard/parameters/ocean_freight');

    return { message: 'Ocean freight added successfully' };
  });
