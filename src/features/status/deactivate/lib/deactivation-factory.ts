export interface BulkDeactivateInput {
  hemicode: string;
  status?: string;
}

export function createBulkDeactivateData(
  input: BulkDeactivateInput,
  rowIndex: number = 1
) {
  const errors: string[] = [];
  const row = rowIndex + 1;
  const msg = (m: string) => `[Row ${row}] ${m}`;

  // hemicode requerido
  if (!input.hemicode || input.hemicode.trim() === '') {
    errors.push(msg("The field 'HEMICODE' is required and cannot be empty."));
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
