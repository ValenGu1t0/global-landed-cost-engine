import { NewHTSCode } from '@/db/schema';
import { AddHTSCodeSchema } from '../actions/add-hts-code-schema';

export function createHTSCodeData(input: AddHTSCodeSchema): NewHTSCode {
  return {
    hts_code: input.hts_code,
    hts_category: input.hts_category,
    min_value: input.min_value,
    max_value: input.max_value,
    type: input.type,
    duty: input.duty,
    cost_group: input.cost_group,
    hts_product_subtype: input.hts_product_subtype,
    fixed_duty_per_piece: input.fixed_duty_per_piece,
    notes: input.notes
  };
}
