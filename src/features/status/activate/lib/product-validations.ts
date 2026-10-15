import { ProductInput } from './product-factory';
import { REQUIRED_FIELDS } from '@/lib/validations/product-required';

function validateRequiredString(value: string | null | undefined): boolean {
  if (value === null || value === undefined) return false;
  return String(value).trim().length > 0;
}

function isPresent(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return !Number.isNaN(value);
  return true;
}

export function validateProduct(
  product: ProductInput,
  rowIndex: number
): string[] {
  const errors: string[] = [];
  const rowDisplay = rowIndex + 2;
  const msg = (m: string) => `[Row ${rowDisplay}] ${m}`;

  const productStatus = String(product.status).toUpperCase();

  const requiredFields =
    REQUIRED_FIELDS[productStatus as keyof typeof REQUIRED_FIELDS] ?? [];

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
  currentStatus: string,
  headerRow: string[]
): string[] {
  const errors: string[] = [];
  const rowDisplay = rowIndex + 2;
  const msg = (m: string) => `[Row ${rowDisplay}] ${m}`;

  const productStatus = currentStatus.toUpperCase();

  const requiredFields =
    REQUIRED_FIELDS[productStatus as keyof typeof REQUIRED_FIELDS] ?? [];

  for (const field of requiredFields) {
    if (!headerRow.includes(field)) continue;

    const value = product[field as keyof ProductInput];
    const fieldName = field.replace(/_/g, ' ').toUpperCase();

    if (!isPresent(value)) {
      errors.push(
        msg(
          `The field '${fieldName}' is required for status '${productStatus}' and cannot be empty when included in the file.`
        )
      );
    }
  }

  return errors;
}

export function validateProductActivate(
  product: Record<string, unknown>,
  rowIndex: number,
  headerRow: string[]
): string[] {
  const errors: string[] = [];
  const rowDisplay = rowIndex + 2;
  const msg = (m: string) => `[Row ${rowDisplay}] ${m}`;

  const targetStatus = 'ACTIVE';

  const requiredFields =
    REQUIRED_FIELDS[targetStatus as keyof typeof REQUIRED_FIELDS] ?? [];

  for (const field of requiredFields) {
    const value = product[field];
    const fieldName = field.replace(/_/g, ' ').toUpperCase();

    if (!isPresent(value)) {
      errors.push(
        msg(
          `The field '${fieldName}' is required to ACTIVATE the product and cannot be empty.`
        )
      );
    }
  }

  return errors;
}
