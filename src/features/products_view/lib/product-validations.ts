import { ProductInput } from './product-factory';
import { REQUIRED_FIELDS } from '@/lib/validations/product-required';

// Helper para validar strings requeridos
function validateRequiredString(value: string | null | undefined): boolean {
  if (value === null || value === undefined) return false;
  return String(value).trim().length > 0;
}

export function validateProduct(
  product: ProductInput,
  rowIndex: number
): string[] {
  const errors: string[] = [];
  const rowDisplay = rowIndex + 2;
  const msg = (m: string) => `[Row ${rowDisplay}] ${m}`;

  // Determinar qué campos requeridos usar según el status
  const productStatus = String(product.status).toUpperCase();

  const requiredFields =
    REQUIRED_FIELDS[productStatus as keyof typeof REQUIRED_FIELDS] ?? [];

  // Validación de campos obligatorios según el tipo
  for (const field of requiredFields) {
    const value = product[field as keyof ProductInput];
    const fieldName = field.replace(/_/g, ' ').toUpperCase();

    if (typeof value === 'string' || value === null || value === undefined) {
      if (!validateRequiredString(value as any)) {
        errors.push(
          msg(`The field '${fieldName}' is required and cannot be empty.`)
        );
      }
    } else {
      if (value === null || value === undefined) {
        errors.push(
          msg(`The field '${fieldName}' is required and cannot be empty.`)
        );
      }
    }
  }

  return errors;
}

export function validateProductUpdate(
  product: ProductInput,
  rowIndex: number,
  currentStatus: string, // El status se obtiene de la DB
  headerRow: string[] // Las columnas presentes en el Excel
): string[] {
  const errors: string[] = [];
  const rowDisplay = rowIndex + 2;
  const msg = (m: string) => `[Row ${rowDisplay}] ${m}`;

  // Determinamos que campos requeridos usar según el status del producto consultado
  const productStatus = currentStatus.toUpperCase();

  const requiredFields =
    REQUIRED_FIELDS[productStatus as keyof typeof REQUIRED_FIELDS] ?? [];

  // Validación: Si una columna es obligatoria para el status y ESTÁ PRESENTE en el Excel, NO puede tener un valor nulo/vacío.
  // **Si no se sube la columna, la validación se ignora.**
  for (const field of requiredFields) {
    const fieldName = field.replace(/_/g, ' ').toUpperCase();

    // La columna OBLIGATORIA debe estar presente en el Excel.
    if (headerRow.includes(field)) {
      const value = product[field as keyof ProductInput];

      if (!isPresent(value)) {
        errors.push(
          msg(
            `The field '${fieldName}' is required for status '${productStatus}' and cannot be empty when included in the file.`
          )
        );
      }
    }
  }

  return errors;
}

// Helper: necesita reexportarse o definirse aquí también
function isPresent(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return !Number.isNaN(value);
  return true;
}
