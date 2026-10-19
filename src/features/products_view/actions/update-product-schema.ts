import * as z from 'zod';
import { REQUIRED_FIELDS } from '@/lib/validations/product-required';

// Helper que convierte una cadena vacía a undefined antes de validar como número.
const optionalNumber = z
  .union([z.literal(''), z.number().optional()])
  .transform((e) => (e === '' ? undefined : e));

export const updateProductSchema = z
  .object({
    tech_sku_id: z.coerce.number(),

    hts_category: z.string().optional().nullable(),
    cn_code: z.string().optional().nullable(),
    status: z.string(),
    factory_code: z.string().optional().nullable(),
    factory_mold: z.string().optional().nullable(),
    item_upc: z.string().optional().nullable(),
    case_upc: z.string().optional().nullable(),
    origin_country: z.string(),
    vendor: z.string(),
    brand_name: z.string(),
    factory_name: z.string(),
    description: z.string(),
    short_description: z.string().optional().nullable(),

    super_category: z.string(),
    category: z.string(),
    sub_category: z.string().optional().nullable(),
    consumer_use: z.string().optional().nullable(),
    set_collection: z.string().optional().nullable(),
    product_collection: z.string().optional().nullable(),
    process_type: z.string().optional().nullable(),
    season: z.string().optional().nullable(),

    color_family: z.string().optional().nullable(),
    color_description: z.string().optional().nullable(),
    tosaf_code: z.string().optional().nullable(),
    pantone_code: z.string().optional().nullable(),

    raw_material: z.string().optional().nullable(),
    finishing: z.string().optional().nullable(),
    packing: z.string(),
    shipping_pack: z.string().optional().nullable(),
    label: z.string().optional().nullable(),

    pieces_per_unit: z.coerce.number(),
    case_pack: z.coerce.number(),

    receiving_carton_per_pallet: z.coerce.number().optional().nullable(),
    ti: z.coerce.number().optional().nullable(),
    hi: z.coerce.number().optional().nullable(),

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

    product_length_mm: z.coerce.number().optional().nullable(),
    product_width_mm: z.coerce.number().optional().nullable(),
    product_height_mm: z.coerce.number().optional().nullable(),
    product_weight_kg: z.coerce.number().optional().nullable(),
    product_volume_ml: z.coerce.number().optional().nullable(),

    carton_length_mm: z.coerce.number().optional().nullable(),
    carton_width_mm: z.coerce.number().optional().nullable(),
    carton_height_mm: z.coerce.number().optional().nullable(),

    pieces_per_polybag: z.coerce.number().optional().nullable(),
    polybag_per_pallet: z.coerce.number().optional().nullable(),
    carton_weight_kg: z.coerce.number().optional().nullable(),

    vendor_pallet_lenght: z.coerce.number().optional().nullable(),
    vendor_pallet_width: z.coerce.number().optional().nullable(),

    commission_percentage: z.coerce.number().optional().nullable(),
    stacked_pallets: z.coerce.number().optional().nullable(),

    pre_price: z.boolean().optional().nullable(),
    carton_per_american_pallet: z.coerce.number().optional().nullable(),

    loading_type: z.string().optional().nullable(),
    hts_product_subtype: z.string().optional().nullable(),

    polybag_to_carton_length_mm: z.coerce.number().optional().nullable(),
    polybag_to_carton_width_mm: z.coerce.number().optional().nullable(),
    polybag_to_carton_height_mm: z.coerce.number().optional().nullable(),

    polybag_product_pallets_per_40hc: z.coerce.number().optional().nullable(),
    polybag_length_mm: z.coerce.number().optional().nullable(),
    polybag_width_mm: z.coerce.number().optional().nullable(),
    polybag_height_mm: z.coerce.number().optional().nullable(),

    set_length_mm: z.coerce.number().optional().nullable(),
    set_width_mm: z.coerce.number().optional().nullable(),
    set_height_mm: z.coerce.number().optional().nullable(),

    notes: z.string().optional().nullable(),

    polybag_product_pallets_per_53ft: z.coerce.number().optional().nullable(),
    polybag_pallet_type: z.string().optional().nullable(),

    mrsp: z.coerce.number().optional().nullable(),
    cbm_const: z.coerce.number(),
    cbm: z.coerce.number().optional().nullable(),
    product_or_kit: z.string(),

    confirmed_carton_per_40hc: z.coerce.number().optional().nullable(),
    confirmed_carton_per_45hc: z.coerce.number().optional().nullable(),
    confirmed_carton_per_40std: z.coerce.number().optional().nullable(),
    confirmed_carton_per_20std: z.coerce.number().optional().nullable(),
    confirmed_carton_per_53ft: z.coerce.number().optional().nullable(),

    project_id: z.string().optional().nullable(),
    set_weight_kg: z.coerce.number().optional().nullable(),

    image_in_process: z.boolean(),

    vendor_pallet_height: z.coerce.number().optional().nullable(),

    polybag_product_pallets_per_45hc: z.coerce.number().optional().nullable(),
    polybag_product_pallets_per_40std: z.coerce.number().optional().nullable(),
    polybag_product_pallets_per_20std: z.coerce.number().optional().nullable()
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
        break;
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

export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
