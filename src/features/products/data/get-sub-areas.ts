'use server';

import { getSubAreasSchema, GetSubAreasSchema } from './get-sub-areas-schema';
import { ValidationError } from '@/lib/errors';
import { SUB_AREAS } from './constants';

export interface SubArea {
  id: string;
  label: string;
  areaId: string;
}

export async function getSubAreas(
  input: GetSubAreasSchema
): Promise<SubArea[]> {
  const result = getSubAreasSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error));
  }

  const { areaId } = result.data;

  return SUB_AREAS.filter((subArea) => subArea.areaId === areaId);
}
