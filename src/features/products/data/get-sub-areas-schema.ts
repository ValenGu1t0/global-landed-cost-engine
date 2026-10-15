import * as z from 'zod';

export const getSubAreasSchema = z.object({
  areaId: z.string().min(1, 'El ID del área es requerido')
});

export type GetSubAreasSchema = z.infer<typeof getSubAreasSchema>;
