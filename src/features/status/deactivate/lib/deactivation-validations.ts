import { BulkDeactivateInput } from './deactivation-factory';

export function validateDeactivateRow(
  product: BulkDeactivateInput,
  rowIndex: number
) {
  const errors: string[] = [];
  const row = rowIndex + 2;
  const msg = (m: string) => `[Row ${row}] ${m}`;

  // cn_code requerido
  if (!product.cn_code || String(product.cn_code).trim() === '') {
    errors.push(msg("The field 'CN_CODE' is required and cannot be empty."));
  }

  // status NO puede ser INACTIVE dentro del excel
  if (product.status) {
    const statusVal = String(product.status).trim().toUpperCase();
    if (statusVal === 'INACTIVE') {
      errors.push(
        msg(
          "Column 'STATUS' must NOT contain 'INACTIVE'. Only ACTIVE or empty."
        )
      );
    }
  }

  return errors;
}
