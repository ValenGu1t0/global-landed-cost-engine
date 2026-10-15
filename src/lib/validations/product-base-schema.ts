import { z } from 'zod';

export const productBaseSchema = z.object({
  tech_sku_id: z.number().optional(),

  hts_category: z.string().max(7).optional(),
  hemicode: z.string().max(30).optional(),
  status: z.string().optional(),
  factory_code: z.string().max(50).optional(),
  factory_mold: z.string().max(50).optional(),
  item_upc: z.string().optional(),
  case_upc: z.string().optional(),

  origin_country: z.string().optional(),
  vendor: z.string().optional(),
  brand_name: z.string().optional(),
  factory_name: z.string().optional(),
  description: z.string().optional(),
  short_description: z.string().optional(),

  super_category: z.string().optional(),
  category: z.string().optional(),
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
  packing: z.string().optional(),
  shipping_pack: z.string().optional(),
  label: z.string().optional(),

  pieces_per_unit: z.number().optional(),
  case_pack: z.number().optional(),
  receiving_carton_per_pallet: z.number().optional(),
  ti: z.number().optional(),
  hi: z.number().optional(),

  fob: z.number().optional(),
  exw: z.number().optional(),
  cnf: z.number().optional(),
  ddp: z.number().optional(),

  product_length_mm: z.number().optional(),
  product_width_mm: z.number().optional(),
  product_height_mm: z.number().optional(),
  product_weight_kg: z.number().optional(),
  product_volume_ml: z.number().optional(),

  carton_length_mm: z.number().optional(),
  carton_width_mm: z.number().optional(),
  carton_height_mm: z.number().optional(),

  pieces_per_polybag: z.number().optional(),
  polybag_per_pallet: z.number().optional(),
  carton_weight_kg: z.number().optional(),

  vendor_pallet_lenght: z.number().optional(),
  vendor_pallet_width: z.number().optional(),

  commission_percentage: z.number().optional(),
  stacked_pallets: z.number().optional(),

  pre_price: z.boolean().optional(),
  carton_per_american_pallet: z.number().optional(),
  cnf_diff: z.number().optional(),

  loading_type: z.string().optional(),
  hts_product_subtype: z.string().optional(),

  polybag_to_carton_length_mm: z.number().optional(),
  polybag_to_carton_width_mm: z.number().optional(),
  polybag_to_carton_height_mm: z.number().optional(),

  polybag_product_pallets_per_40hc: z.number().optional(),
  polybag_length_mm: z.number().optional(),
  polybag_width_mm: z.number().optional(),
  polybag_height_mm: z.number().optional(),

  set_length_mm: z.number().optional(),
  set_width_mm: z.number().optional(),
  set_height_mm: z.number().optional(),

  notes: z.string().optional(),

  polybag_product_pallets_per_53ft: z.number().optional(),
  polybag_pallet_type: z.string().optional(),

  mrsp: z.number().optional(),
  cbm: z.number().optional(),
  cbm_const: z.number().optional(),
  product_or_kit: z.string().optional(),

  confirmed_carton_per_40hc: z.number().optional(),
  confirmed_carton_per_45hc: z.number().optional(),
  confirmed_carton_per_40std: z.number().optional(),
  confirmed_carton_per_20std: z.number().optional(),
  confirmed_carton_per_53ft: z.number().optional(),

  project_id: z.string().optional(),
  set_weight_kg: z.number().optional(),

  image_in_process: z.boolean().optional(),

  vendor_pallet_height: z.number().optional(),

  polybag_product_pallets_per_45hc: z.number().optional(),
  polybag_product_pallets_per_40std: z.number().optional(),
  polybag_product_pallets_per_20std: z.number().optional()
});
