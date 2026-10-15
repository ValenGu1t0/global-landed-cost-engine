import { BulkDeactivateInput } from './deactivation-factory';

export function validateDeactivateRow(
  product: BulkDeactivateInput,
  rowIndex: number
) {
  const errors: string[] = [];
  const row = rowIndex + 2;
  const msg = (m: string) => `[Row ${row}] ${m}`;

  // hemicode requerido
  if (!product.hemicode || String(product.hemicode).trim() === '') {
    errors.push(msg("The field 'HEMICODE' is required and cannot be empty."));
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
