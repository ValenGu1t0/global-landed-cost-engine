import fs from 'fs/promises';
import path from 'path';
import db from '@/db';
import { sql } from 'drizzle-orm';

export async function runSqlFile(relativePath: string) {
  try {
    const absolutePath = path.join(process.cwd(), relativePath);
    const content = await fs.readFile(absolutePath, 'utf8');

    // Separar comandos por ';'
    const statements = content
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const stmt of statements) {
      await db.execute(sql.raw(stmt));
    }

    console.log(`Executed SQL file: ${relativePath}`);
  } catch (err) {
    console.error(`Error executing SQL file: ${relativePath}`, err);
  }
}
