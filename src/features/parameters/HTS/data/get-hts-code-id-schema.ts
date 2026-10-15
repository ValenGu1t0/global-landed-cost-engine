import * as z from 'zod';

export const getHTSCodeSchema = z.object({
  hts_code: z.string()
});

export type GetHTSCodeSchema = z.infer<typeof getHTSCodeSchema>;
