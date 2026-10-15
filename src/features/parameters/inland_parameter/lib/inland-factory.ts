import { NewInlandParameter } from '@/db/schema';
import { AddInlandParameterSchema } from '../actions/add-inland-parameter-schema';

/* No esta de mas este componente me parece? */

export function createInlandParameterData(
  input: AddInlandParameterSchema,
  userId: string
): NewInlandParameter {
  return {
    inland_type: input.inland_type,
    port: input.port,
    country: input.country,
    start_date: new Date().toISOString(),
    end_date: '2100-01-01T00:00:00Z',
    zip_code: input.zip_code,
    value: input.value,
    cost_group: input.cost_group,
    user: userId
  };
}
