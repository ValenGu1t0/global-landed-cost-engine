import { NewOtherParameter } from '@/db/schema';
import { AddOtherParameterSchema } from '../actions/add-other_parameter-schema';

export function createOtherParameterData(
  input: AddOtherParameterSchema
): NewOtherParameter {
  return {
    parameter: input.parameter,
    value: input.value,
    cost_group: input.cost_group
  };
}
