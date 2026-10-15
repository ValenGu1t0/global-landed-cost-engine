'use server';

import { runSqlFile } from '@/lib/db/run-sql-file';

export async function runPreprocessingScripts() {
  /* await runSqlFile('src/sql/postgress_public/2_products_postgres.sql');
  await runSqlFile('src/sql/postgress_public/3_kits_postgres.sql'); */
  await runSqlFile(
    'src/sql/postgress_public/4_product_view_table_temp_postgres.sql'
  );
  await runSqlFile('src/sql/postgress_public/5_merge_postgres.sql');
  /* await runSqlFile('src/sql/postgress_public/6_delete_temp_postgres.sql'); */
}
