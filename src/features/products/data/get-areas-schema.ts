import * as z from 'zod';

export const getAreasSchema = z.object({});

export type GetAreasSchema = z.infer<typeof getAreasSchema>;
