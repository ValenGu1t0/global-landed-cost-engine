import { z } from 'zod';
import { productBaseSchema } from './product-base-schema';
import { REQUIRED_FIELDS } from './product-required';

type ProductField = keyof typeof productBaseSchema.shape;

const requiredMap = {
  ACTIVE: REQUIRED_FIELDS.ACTIVE,
  INACTIVE: REQUIRED_FIELDS.INACTIVE,
  PROJECT: REQUIRED_FIELDS.PROJECT
} as const;

export function buildProductSchema(status: keyof typeof requiredMap) {
  const requiredFields = requiredMap[status];

  // Creamos un schema base
  let schema = productBaseSchema;

  for (const field of requiredFields) {
    const typedField = field as ProductField;

    const base = productBaseSchema.shape[typedField];

    // Validación dinámica usando refine
    schema = schema.refine(
      (data) => {
        const v = data[typedField];
        return v !== null && v !== undefined && v !== '';
      },
      {
        message: `${typedField} is required`,
        path: [typedField]
      }
    );
  }

  return schema;
}
