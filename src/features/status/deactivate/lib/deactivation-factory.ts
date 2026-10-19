export interface BulkDeactivateInput {
  cn_code: string;
  status?: string;
}

export function createBulkDeactivateData(
  input: BulkDeactivateInput,
  rowIndex: number = 1
) {
  const errors: string[] = [];
  const row = rowIndex + 1;
  const msg = (m: string) => `[Row ${row}] ${m}`;

  // cn_code requerido
  if (!input.cn_code || input.cn_code.trim() === '') {
    errors.push(msg("The field 'CN_CODE' is required and cannot be empty."));
  }

  // Si viene "status", debe NO ser INACTIVE (regla del negocio)
  if (input.status && input.status.trim().toUpperCase() === 'INACTIVE') {
    errors.push(
      msg(
        "Column 'STATUS' must NOT contain 'INACTIVE'. Remove it from the file or leave the column empty."
      )
    );
  }

  return { errors };
}
