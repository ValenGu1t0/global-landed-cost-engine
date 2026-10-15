import { NewIncotermCostGroup } from '@/db/schema';
import { AddIncotermCostGroupSchema } from '../actions/add-incoterm_cost_group-schema';

export function createIncotermCostGroupData(
  input: AddIncotermCostGroupSchema,
  userId: string
): NewIncotermCostGroup {
  return {
    cost_group: input.cost_group,
    vendor: input.vendor,
    country: input.country,
    incoterm: input.incoterm
  };
}
