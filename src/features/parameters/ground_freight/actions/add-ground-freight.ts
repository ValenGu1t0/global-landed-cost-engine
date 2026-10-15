'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { addGroundFreightSchema } from './add-ground-freight-schema';
import db from '@/db';
import { groundFreightTable } from '@/db/schema';
import { and, eq, gte, lte } from 'drizzle-orm';
import { ValidationError } from '@/lib/errors';
import { revalidatePath } from 'next/cache';

export const addGroundFreight = authActionClient
  .metadata({ actionName: 'addGroundFreight' })
  .inputSchema(addGroundFreightSchema)
  .action(async ({ parsedInput, ctx }) => {
    const {
      vendor,
      factory_name,
      origin_country,
      destination_country,
      destination_warehouse,
      container_type,
      cost_detail,
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
        .select({ id: groundFreightTable.id })
        .from(groundFreightTable)
        .where(
          and(
            eq(groundFreightTable.vendor, vendor),
            eq(groundFreightTable.factory_name, factory_name),
            eq(groundFreightTable.origin_country, origin_country),
            eq(groundFreightTable.destination_country, destination_country),
            eq(groundFreightTable.destination_warehouse, destination_warehouse),
            eq(groundFreightTable.container_type, container_type),
            gte(groundFreightTable.start_date, todayStart.toISOString()),
            lte(groundFreightTable.start_date, todayEnd.toISOString())
          )
        )
        .limit(1);

      if (alreadyCreatedToday.length > 0) {
        throw new ValidationError(
          'A ground freight with the same parameters was already created today. Please edit the existing record instead.'
        );
      }

      // 1) Buscar TODOS los registros con las PK
      const records = await tx
        .select()
        .from(groundFreightTable)
        .where(
          and(
            eq(groundFreightTable.vendor, vendor),
            eq(groundFreightTable.factory_name, factory_name),
            eq(groundFreightTable.origin_country, origin_country),
            eq(groundFreightTable.destination_country, destination_country),
            eq(groundFreightTable.destination_warehouse, destination_warehouse),
            eq(groundFreightTable.container_type, container_type)
          )
        );

      // 2) Encontrar el registro activo (end_date = año 2100)
      const active = records.find((r) => {
        if (!r.end_date) return false;
        const end = new Date(r.end_date);
        return end.getFullYear() === 2100;
      });

      if (active) {
        // Cerrar registro activo
        await tx
          .update(groundFreightTable)
          .set({
            end_date: yesterday.toISOString(),
            user: userEmail
          })
          .where(eq(groundFreightTable.id, active.id));
      }

      // 3) Insertar nuevo registro válido
      await tx.insert(groundFreightTable).values({
        vendor,
        factory_name,
        origin_country,
        destination_country,
        destination_warehouse,
        container_type,
        cost_detail,
        value,
        cost_group,
        start_date: today.toISOString(),
        end_date: '2100-01-01T00:00:00Z',
        user: userEmail
      });
    });

    //These are the scripts required for product calculations directly related to Ground Freight
    import('@/lib/db/run-sql-file').then(async ({ runSqlFile }) => {
      try {
        await runSqlFile(
          'src/sql/Truncated Scripts/16_current_ground_freights_truncate.sql'
        );
        await runSqlFile(
          'src/sql/Truncated Scripts/17_ground_logistic_per_container_calculations_truncate.sql'
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

    revalidatePath('/dashboard/parameters/ground_freight');

    return { message: 'Ground freight added successfully' };
  });
