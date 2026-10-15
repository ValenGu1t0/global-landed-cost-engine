import db from '@/db';
import { sql } from 'drizzle-orm';

export const DEMO_CONFIG = {
  MAX_EXCEL_ROWS: 10,
  MAX_DAILY_ITEMS_PER_USER: 10
} as const;

let tableEnsured = false;

async function ensureRateLimitTable() {
  if (tableEnsured) return;
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS public.demo_rate_limits (
        user_id VARCHAR(100) NOT NULL,
        action_key VARCHAR(50) NOT NULL,
        date_key VARCHAR(10) NOT NULL,
        usage_count INT NOT NULL DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, action_key, date_key)
      );
    `);
    tableEnsured = true;
  } catch (err) {
    console.error('Failed to ensure demo_rate_limits table:', err);
  }
}

/**
 * Validates that an uploaded Excel row array does not exceed the demo limit.
 * Returns null if valid, or an error payload if exceeded.
 */
export function validateExcelRowCount(
  data: any[],
  resourceName: string = 'items'
): { success: false; message: string; errors: string[] } | null {
  if (data.length > DEMO_CONFIG.MAX_EXCEL_ROWS) {
    return {
      success: false,
      message: `Demo Mode Limit: The uploaded spreadsheet contains ${data.length} ${resourceName}. Maximum allowed is ${DEMO_CONFIG.MAX_EXCEL_ROWS} items per operation.`,
      errors: [
        `Portfolio Demo Guardrail: ${data.length} rows detected (max limit is ${DEMO_CONFIG.MAX_EXCEL_ROWS}).`,
        `Please edit your spreadsheet to contain at most ${DEMO_CONFIG.MAX_EXCEL_ROWS} rows to test the upload pipeline safely.`
      ]
    };
  }
  return null;
}

/**
 * Checks and increments the daily operation quota for a given user.
 */
export async function checkAndConsumeDemoQuota(
  userId?: string | null,
  requestedCount: number = 1,
  actionKey: string = 'product_create'
): Promise<{
  allowed: boolean;
  remaining: number;
  currentCount: number;
  message?: string;
}> {
  await ensureRateLimitTable();
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const effectiveUserId = userId || 'anonymous_demo_user';

  try {
    const res: any = await db.execute(sql`
      SELECT usage_count FROM public.demo_rate_limits
      WHERE user_id = ${effectiveUserId} AND action_key = ${actionKey} AND date_key = ${today}
    `);

    const currentCount = Number(res.rows?.[0]?.usage_count || 0);

    if (currentCount + requestedCount > DEMO_CONFIG.MAX_DAILY_ITEMS_PER_USER) {
      const remaining = Math.max(
        0,
        DEMO_CONFIG.MAX_DAILY_ITEMS_PER_USER - currentCount
      );
      return {
        allowed: false,
        remaining,
        currentCount,
        message: `Demo Quota Exceeded: You have processed ${currentCount}/${DEMO_CONFIG.MAX_DAILY_ITEMS_PER_USER} operations today. Only ${remaining} remaining. (Resets at 00:00 UTC).`
      };
    }

    await db.execute(sql`
      INSERT INTO public.demo_rate_limits (user_id, action_key, date_key, usage_count, updated_at)
      VALUES (${effectiveUserId}, ${actionKey}, ${today}, ${requestedCount}, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, action_key, date_key)
      DO UPDATE SET 
        usage_count = demo_rate_limits.usage_count + ${requestedCount},
        updated_at = CURRENT_TIMESTAMP;
    `);

    return {
      allowed: true,
      remaining:
        DEMO_CONFIG.MAX_DAILY_ITEMS_PER_USER - (currentCount + requestedCount),
      currentCount: currentCount + requestedCount
    };
  } catch (err) {
    console.error('Error during demo quota check:', err);
    // Fail open in case of network edge issues during demo presentation
    return {
      allowed: true,
      remaining: DEMO_CONFIG.MAX_DAILY_ITEMS_PER_USER,
      currentCount: 0
    };
  }
}
