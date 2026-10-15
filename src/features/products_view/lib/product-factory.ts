import { NewProductTable } from '@/db/schema';
import { validateProduct } from './product-validations';

export interface ProductInput {
  // Identificación y Códigos
  tech_sku_id: number; // serial - PrimaryKey
  hts_category?: string; // varchar(7)
  hemicode?: string; // varchar(30) - Unique
  status: string; // varchar(20) - NotNull
  factory_code?: string; // varchar(50)
  factory_mold?: string; // varchar(50)
  item_upc?: string; // varchar(200)
  case_upc?: string; // varchar(20)
  origin_country: string; // varchar(50) - NotNull
  vendor: string; // varchar(50) - NotNull
  brand_name: string; // varchar(50) - NotNull
  factory_name: string; // varchar(50) - NotNull
  description: string; // varchar(400) - NotNull
  short_description?: string; // varchar(100)

  // Clasificación
  super_category: string; // varchar(30) - NotNull
  category: string; // varchar(50) - NotNull
  sub_category?: string; // varchar(30)
  consumer_use?: string; // varchar(30)
  set_collection?: string; // varchar(30)
  product_collection?: string; // varchar(30)
  process_type?: string; // varchar(30)
  season?: string; // varchar(30)
  product_or_kit: string; // varchar(30) - NotNull (default: 'PRODUCT')

  // Color
  color_family?: string; // varchar(30)
  color_description?: string; // varchar(200)
  tosaf_code?: string; // varchar(200)
  pantone_code?: string; // varchar(200)

  // Material y Empaque
  raw_material?: string; // varchar(50)
  finishing?: string; // varchar(30)
  packing: string; // varchar(30) - NotNull
  shipping_pack?: string; // varchar(30)
  label?: string; // varchar(200)

  // Cantidades y Pallets
  pieces_per_unit: number; // integer - NotNull
  case_pack: number; // integer - NotNull
  receiving_carton_per_pallet?: number; // integer
  ti?: number; // integer
  hi?: number; // integer
  pieces_per_polybag?: number; // integer
  polybag_per_pallet?: number; // integer
  stacked_pallets?: number; // integer
  carton_per_american_pallet?: number; // integer

  // Precios
  fob?: number; // real
  exw?: number; // real
  cnf?: number; // real
  ddp?: number; // real
  mrsp?: number; // real

  // Dimensiones y Peso del Producto
  product_length_mm?: number; // real
  product_width_mm?: number; // real
  product_height_mm?: number; // real
  product_weight_kg?: number; // real
  product_volume_ml?: number; // real

  // Dimensiones y Peso de la Caja
  carton_length_mm?: number; // real
  carton_width_mm?: number; // real
  carton_height_mm?: number; // real
  carton_weight_kg?: number; // real

  // Dimensiones del Pallet del Vendedor
  vendor_pallet_lenght?: number; // real
  vendor_pallet_width?: number; // real
  vendor_pallet_height?: number; // real

  // Precios y Costos
  commission_percentage?: number; // real
  pre_price?: boolean; // boolean
  cnf_diff?: number;
  cbm?: number; // real
  cbm_const: number; // real - NotNull (default: 0)

  // Logística y Confirmación de Contenedores
  loading_type?: string; // varchar(30)
  hts_product_subtype?: string; // varchar(200)

  // Dimensiones de Polybag a Caja
  polybag_to_carton_length_mm?: number; // real
  polybag_to_carton_width_mm?: number; // real
  polybag_to_carton_height_mm?: number; // real

  // Pallets de Polybag por Contenedor
  polybag_product_pallets_per_40hc?: number; // integer
  polybag_product_pallets_per_53ft?: number; // integer
  polybag_product_pallets_per_45hc?: number; // integer
  polybag_product_pallets_per_40std?: number; // integer
  polybag_product_pallets_per_20std?: number; // integer
  polybag_pallet_type?: string; // varchar(10)

  // Dimensiones de Polybag
  polybag_length_mm?: number; // real
  polybag_width_mm?: number; // real
  polybag_height_mm?: number; // real

  // Dimensiones de Set
  set_length_mm?: number; // real
  set_width_mm?: number; // real
  set_height_mm?: number; // real
  set_weight_kg?: number; // real

  // Notas e Imágenes
  notes?: string; // varchar(250)
  image_in_process: boolean; // boolean - NotNull (default: false)

  // Confirmados de Caja por Contenedor
  confirmed_carton_per_40hc?: number; // integer
  confirmed_carton_per_45hc?: number; // integer
  confirmed_carton_per_40std?: number; // integer
  confirmed_carton_per_20std?: number; // integer
  confirmed_carton_per_53ft?: number; // integer

  // Proyecto
  project_id?: string; // varchar(20)
}

export interface BulkHemicodeUpdateInput {
  old_hemicode: string;
  new_hemicode: string;
}

// Función central de la fábrica: transforma el input de Zod/Formulario a la estructura de Drizzle.
export function createProductData(
  input: ProductInput,
  rowIndex: number = +1 // ?
): NewProductTable {
  validateProduct(input, rowIndex);

  return {
    tech_sku_id: input.tech_sku_id,

    // Bools
    image_in_process: input.image_in_process || false,
    pre_price: input.pre_price || false,

    // String (Varchar)
    status: input.status,
    hts_category: input.hts_category,
    hemicode: input.hemicode,
    factory_code: input.factory_code,
    factory_mold: input.factory_mold,
    item_upc: input.item_upc,
    case_upc: input.case_upc,
    origin_country: input.origin_country,
    vendor: input.vendor,
    brand_name: input.brand_name,
    factory_name: input.factory_name,
    description: input.description,
    short_description: input.short_description,
    super_category: input.super_category,
    category: input.category,
    sub_category: input.sub_category,
    consumer_use: input.consumer_use,
    set_collection: input.set_collection,
    product_collection: input.product_collection,
    process_type: input.process_type,
    season: input.season,
    color_family: input.color_family,
    color_description: input.color_description,
    tosaf_code: input.tosaf_code,
    pantone_code: input.pantone_code,
    raw_material: input.raw_material,
    finishing: input.finishing,
    packing: input.packing,
    shipping_pack: input.shipping_pack,
    label: input.label,
    loading_type: input.loading_type,
    hts_product_subtype: input.hts_product_subtype,
    notes: input.notes,
    polybag_pallet_type: input.polybag_pallet_type,
    product_or_kit: input.product_or_kit,

    // Integer
    pieces_per_unit: input.pieces_per_unit,
    case_pack: input.case_pack,
    receiving_carton_per_pallet: input.receiving_carton_per_pallet,
    ti: input.ti,
    hi: input.hi,
    pieces_per_polybag: input.pieces_per_polybag,
    polybag_per_pallet: input.polybag_per_pallet,
    stacked_pallets: input.stacked_pallets,
    carton_per_american_pallet: input.carton_per_american_pallet,

    // Integer - Confirmados de Contenedor
    polybag_product_pallets_per_40hc: input.polybag_product_pallets_per_40hc,
    polybag_product_pallets_per_53ft: input.polybag_product_pallets_per_53ft,
    confirmed_carton_per_40hc: input.confirmed_carton_per_40hc,
    confirmed_carton_per_45hc: input.confirmed_carton_per_45hc,
    confirmed_carton_per_40std: input.confirmed_carton_per_40std,
    confirmed_carton_per_20std: input.confirmed_carton_per_20std,
    confirmed_carton_per_53ft: input.confirmed_carton_per_53ft,
    polybag_product_pallets_per_45hc: input.polybag_product_pallets_per_45hc,
    polybag_product_pallets_per_40std: input.polybag_product_pallets_per_40std,
    polybag_product_pallets_per_20std: input.polybag_product_pallets_per_20std,

    // Real (Precios y Costos)
    fob: input.fob,
    exw: input.exw,
    cnf: input.cnf,
    ddp: input.ddp,
    cnf_diff: input.cnf_diff,
    mrsp: input.mrsp,
    cbm: input.cbm,
    cbm_const: input.cbm_const || 0,
    commission_percentage: input.commission_percentage,

    // Real (Dimensiones y Pesos)
    product_length_mm: input.product_length_mm,
    product_width_mm: input.product_width_mm,
    product_height_mm: input.product_height_mm,
    product_weight_kg: input.product_weight_kg,
    product_volume_ml: input.product_volume_ml,
    carton_length_mm: input.carton_length_mm,
    carton_width_mm: input.carton_width_mm,
    carton_height_mm: input.carton_height_mm,
    carton_weight_kg: input.carton_weight_kg,
    vendor_pallet_lenght: input.vendor_pallet_lenght,
    vendor_pallet_width: input.vendor_pallet_width,
    vendor_pallet_height: input.vendor_pallet_height,
    polybag_to_carton_length_mm: input.polybag_to_carton_length_mm,
    polybag_to_carton_width_mm: input.polybag_to_carton_width_mm,
    polybag_to_carton_height_mm: input.polybag_to_carton_height_mm,
    polybag_length_mm: input.polybag_length_mm,
    polybag_width_mm: input.polybag_width_mm,
    polybag_height_mm: input.polybag_height_mm,
    set_length_mm: input.set_length_mm,
    set_width_mm: input.set_width_mm,
    set_height_mm: input.set_height_mm,
    set_weight_kg: input.set_weight_kg,

    // Campo Adicional
    project_id: input.project_id
  };
}

export function createManyProductData(
  inputs: ProductInput[]
): NewProductTable[] {
  return inputs.map((input) => createProductData(input));
}
