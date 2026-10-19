import * as z from 'zod';
import { REQUIRED_FIELDS } from '@/lib/validations/product-required';

// --- Constantes para validación de archivos (Opcional, si manejas uploads) ---
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

// Helper que convierte una cadena vacía a undefined antes de validar como número.
const optionalNumber = z
  .union([z.literal(''), z.number().optional()])
  .transform((e) => (e === '' ? undefined : e));

// Helper para convertir string a number (coerción)
const coerceNumber = z.coerce.number();

// Campo de imagen (mantenido de tu esquema anterior, se puede refinar o eliminar si no se usa)
const imageField = z
  .any()
  .optional()
  .refine((files) => !files || files?.length === 1, 'Image is required.')
  .refine(
    (files) => !files || files?.[0]?.size <= MAX_FILE_SIZE,
    `Max file size is 5MB.`
  )
  .refine(
    (files) => !files || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
    '.jpg, .jpeg, .png and .webp files are accepted.'
  );

// Esquema principal de creación de producto
export const addProductSchema = z
  .object({
    // Campos requeridos (NOT NULL en productTable)
    status: z.string().min(1, { message: 'Status is required.' }),
    origin_country: z
      .string()
      .min(1, { message: 'Origin Country is required.' }),
    vendor: z.string().min(1, { message: 'Vendor is required.' }),
    brand_name: z.string().min(1, { message: 'Brand Name is required.' }),
    factory_name: z.string().min(1, { message: 'Factory Name is required.' }),
    description: z
      .string()
      .min(10, { message: 'Description must be at least 10 characters.' }),
    super_category: z
      .string()
      .min(1, { message: 'Super Category is required.' }),
    category: z.string().min(1, { message: 'Category is required.' }),
    packing: z.string().min(1, { message: 'Packing is required.' }),
    pieces_per_unit: coerceNumber
      .int()
      .positive({ message: 'Must be a positive integer.' }),
    case_pack: coerceNumber
      .int()
      .positive({ message: 'Must be a positive integer.' }),
    cbm_const: coerceNumber.default(0),
    cbm: optionalNumber,
    product_or_kit: z.string().default('PRODUCT'),
    image_in_process: z.boolean().default(false),

    // Campos opcionales (VARCHAR y REAL/INTEGER sin .notNull())
    hts_category: z.string().optional(),
    cn_code: z.string().optional(),
    factory_code: z.string().optional(),
    factory_mold: z.string().optional(),
    item_upc: z.string().optional(),
    case_upc: z.string().optional(),
    short_description: z.string().optional(),
    sub_category: z.string().optional(),
    consumer_use: z.string().optional(),
    set_collection: z.string().optional(),
    product_collection: z.string().optional(),
    process_type: z.string().optional(),
    season: z.string().optional(),
    color_family: z.string().optional(),
    color_description: z.string().optional(),
    tosaf_code: z.string().optional(),
    pantone_code: z.string().optional(),
    raw_material: z.string().optional(),
    finishing: z.string().optional(),
    shipping_pack: z.string().optional(),
    label: z.string().optional(),

    // Números opcionales (usando el helper 'optionalNumber' para manejar campos vacíos del formulario)
    receiving_carton_per_pallet: optionalNumber,
    ti: optionalNumber,
    hi: optionalNumber,

    fob: optionalNumber,
    fob_commentary: z.string().optional(),

    exw: optionalNumber,
    exw_commentary: z.string().optional(),

    cnf: optionalNumber,
    cnf_commentary: z.string().optional(),

    ddp: optionalNumber,
    ddp_commentary: z.string().optional(),

    cnf_diff: optionalNumber,
    cnf_diff_commentary: z.string().optional(),

    product_length_mm: optionalNumber,
    product_width_mm: optionalNumber,
    product_height_mm: optionalNumber,
    product_weight_kg: optionalNumber,
    product_volume_ml: optionalNumber,
    carton_length_mm: optionalNumber,
    carton_width_mm: optionalNumber,
    carton_height_mm: optionalNumber,
    pieces_per_polybag: optionalNumber,
    polybag_per_pallet: optionalNumber,
    carton_weight_kg: optionalNumber,
    vendor_pallet_lenght: optionalNumber,
    vendor_pallet_width: optionalNumber,
    commission_percentage: optionalNumber,
    stacked_pallets: optionalNumber,
    carton_per_american_pallet: optionalNumber,
    polybag_to_carton_length_mm: optionalNumber,
    polybag_to_carton_width_mm: optionalNumber,
    polybag_to_carton_height_mm: optionalNumber,
    polybag_product_pallets_per_40hc: optionalNumber,
    polybag_length_mm: optionalNumber,
    polybag_width_mm: optionalNumber,
    polybag_height_mm: optionalNumber,
    set_length_mm: optionalNumber,
    set_width_mm: optionalNumber,
    set_height_mm: optionalNumber,
    polybag_product_pallets_per_53ft: optionalNumber,
    mrsp: optionalNumber,
    confirmed_carton_per_40hc: optionalNumber,
    confirmed_carton_per_45hc: optionalNumber,
    confirmed_carton_per_40std: optionalNumber,
    confirmed_carton_per_20std: optionalNumber,
    confirmed_carton_per_53ft: optionalNumber,
    set_weight_kg: optionalNumber,
    vendor_pallet_height: optionalNumber,
    polybag_product_pallets_per_45hc: optionalNumber,
    polybag_product_pallets_per_40std: optionalNumber,
    polybag_product_pallets_per_20std: optionalNumber,

    // Strings Opcionales que estaban al final
    loading_type: z.string().optional(),
    hts_product_subtype: z.string().optional(),
    polybag_pallet_type: z.string().optional(),
    project_id: z.string().optional(),
    notes: z.string().optional(),

    // Booleanos que no tienen default en el esquema
    pre_price: z.boolean().optional(),

    // Campo de imagen (si planeas usarlo)
    image: imageField
  })
  .superRefine((data, ctx) => {
    let required: readonly string[] = [];

    switch (data.status) {
      case 'ACTIVE':
        required = REQUIRED_FIELDS.ACTIVE;
        break;
      case 'PROJECT':
        required = REQUIRED_FIELDS.PROJECT;
        break;
      case 'INACTIVE':
        required = REQUIRED_FIELDS.INACTIVE;
      case 'GS':
        required = REQUIRED_FIELDS.GS;
        break;
    }

    required.forEach((field) => {
      const value = (data as any)[field];

      // STRING vacía => error
      if (typeof value === 'string' && value.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${field} is required.`,
          path: [field]
        });
      }

      // NUMÉRICOS opcionales transformados => undefined es inválido
      if (
        typeof value === 'number' &&
        (value === null || value === undefined)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${field} is required.`,
          path: [field]
        });
      }

      // Caso "string vacía pero el helper optionalNumber la transformó a undefined"
      if (
        (value === undefined || value === null) &&
        !['', undefined, null].includes(value)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${field} is required.`,
          path: [field]
        });
      }
    });
  });

export type AddProductSchema = z.infer<typeof addProductSchema>;
