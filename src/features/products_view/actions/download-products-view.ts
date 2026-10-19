'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { downloadProductsViewSchema } from './download-products-view-schema';
import { getProductsView } from '../data/get-products-view';
import { createExcelBase64, ExcelColumnConfig } from '@/lib/excel';
import { EXCEL_DEFAULT_MIME_TYPE } from '@/mime_types';
import { resolveProductImageUrl } from '@/constants/data';
import { ProductsViewTable } from '@/db/schema';

const formatDate = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
};

const today = formatDate(0);
const plus7 = formatDate(7);
const plus14 = formatDate(14);
const plus21 = formatDate(21);
const plus49 = formatDate(49);
const plus77 = formatDate(77);
const plus105 = formatDate(105);

// --- Constante COLUMN_CONFIGS con las 160 columnas ---
const dateToString = (dateValue: Date | string | null): string => {
  if (!dateValue) return '';
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
  // Añade una verificación de si es una fecha válida después de la conversión
  return isNaN(date.getTime()) ? '' : date.toLocaleDateString('es-AR');
};

const boolToText = (boolValue: boolean | null): string => {
  if (boolValue === true) return 'Yes';
  if (boolValue === false) return 'No';
  return '';
};

const numberToFixed2 = (numValue: number | null): string => {
  return typeof numValue === 'number' ? numValue.toFixed(2) : '';
};

const numberToString = (numValue: number | null): string => {
  return typeof numValue === 'number' ? numValue.toString() : '';
};

const COLUMN_CONFIGS: Record<
  keyof ProductsViewTable,
  ExcelColumnConfig<ProductsViewTable>
> = {
  // Campos principales
  tech_sku_id: {
    id: 'tech_sku_id',
    header: 'SKU ID',
    format: (_, row) => row.tech_sku_id?.toString() ?? ''
  },
  cn_code: {
    id: 'cn_code',
    header: 'CN-Code',
    format: (_, row) => row.cn_code || ''
  },
  status: {
    id: 'status',
    header: 'Status',
    format: (_, row) => row.status || ''
  },
  image_in_process: {
    id: 'image_in_process',
    header: 'Image in Process',
    format: (_, row) => boolToText(row.image_in_process)
  },
  factory_code: {
    id: 'factory_code',
    header: 'Factory Code',
    format: (_, row) => row.factory_code || ''
  },
  factory_mold: {
    id: 'factory_mold',
    header: 'Factory Mold',
    format: (_, row) => row.factory_mold || ''
  },
  item_upc: {
    id: 'item_upc',
    header: 'Item UPC',
    format: (_, row) => row.item_upc || ''
  },
  case_upc: {
    id: 'case_upc',
    header: 'Case UPC',
    format: (_, row) => row.case_upc || ''
  },
  vendor: {
    id: 'vendor',
    header: 'Vendor',
    format: (_, row) => row.vendor || ''
  },
  brand_name: {
    id: 'brand_name',
    header: 'Brand Name',
    format: (_, row) => row.brand_name || ''
  },
  origin_country: {
    id: 'origin_country',
    header: 'Origin Country',
    format: (_, row) => row.origin_country || ''
  },
  pre_price: {
    id: 'pre_price',
    header: 'Pre Price',
    format: (_, row) => boolToText(row.pre_price)
  },
  factory_name: {
    id: 'factory_name',
    header: 'Factory Name',
    format: (_, row) => row.factory_name || ''
  },
  description: {
    id: 'description',
    header: 'Description',
    format: (_, row) => row.description || ''
  },
  short_description: {
    id: 'short_description',
    header: 'Short Description',
    format: (_, row) => row.short_description || ''
  },
  super_category: {
    id: 'super_category',
    header: 'Super Category',
    format: (_, row) => row.super_category || ''
  },
  category: {
    id: 'category',
    header: 'Category',
    format: (_, row) => row.category || ''
  },
  sub_category: {
    id: 'sub_category',
    header: 'Sub Category',
    format: (_, row) => row.sub_category || ''
  },
  consumer_use: {
    id: 'consumer_use',
    header: 'Consumer Use',
    format: (_, row) => row.consumer_use || ''
  },
  set_collection: {
    id: 'set_collection',
    header: 'Set Collection',
    format: (_, row) => row.set_collection || ''
  },
  product_collection: {
    id: 'product_collection',
    header: 'Product Collection',
    format: (_, row) => row.product_collection || ''
  },
  process_type: {
    id: 'process_type',
    header: 'Process Type',
    format: (_, row) => row.process_type || ''
  },
  season: {
    id: 'season',
    header: 'Season',
    format: (_, row) => row.season || ''
  },
  color_family: {
    id: 'color_family',
    header: 'Color Family',
    format: (_, row) => row.color_family || ''
  },
  color_description: {
    id: 'color_description',
    header: 'Color Description',
    format: (_, row) => row.color_description || ''
  },
  pantone_code: {
    id: 'pantone_code',
    header: 'Pantone Code',
    format: (_, row) => row.pantone_code || ''
  },
  tosaf_code: {
    id: 'tosaf_code',
    header: 'Tosaf Code',
    format: (_, row) => row.tosaf_code || ''
  },
  raw_material: {
    id: 'raw_material',
    header: 'Raw Material',
    format: (_, row) => row.raw_material || ''
  },
  finishing: {
    id: 'finishing',
    header: 'Finishing',
    format: (_, row) => row.finishing || ''
  },
  shipping_pack: {
    id: 'shipping_pack',
    header: 'Shipping Pack',
    format: (_, row) => row.shipping_pack || ''
  },
  label: {
    id: 'label',
    header: 'Label',
    format: (_, row) => row.label || ''
  },
  packing: {
    id: 'packing',
    header: 'Packing',
    format: (_, row) => row.packing || ''
  },

  // Campos de cantidad y apilamiento
  pieces_per_unit: {
    id: 'pieces_per_unit',
    header: 'Pieces per Unit',
    format: (_, row) => numberToString(row.pieces_per_unit)
  },
  case_pack: {
    id: 'case_pack',
    header: 'Case Pack',
    format: (_, row) => numberToString(row.case_pack)
  },
  pieces_per_carton: {
    id: 'pieces_per_carton',
    header: 'Pieces Per Carton',
    format: (_, row) => numberToString(row.pieces_per_carton)
  },
  carton_per_american_pallet: {
    id: 'carton_per_american_pallet',
    header: 'Carton per American Pallet',
    format: (_, row) => numberToString(row.carton_per_american_pallet)
  },
  estimated_carton_per_american_pallet: {
    id: 'estimated_carton_per_american_pallet',
    header: 'Estimated Carton Per American Pallet',
    format: (_, row) => numberToFixed2(row.estimated_carton_per_american_pallet)
  },
  ti: { id: 'ti', header: 'TI', format: (_, row) => numberToString(row.ti) },
  hi: { id: 'hi', header: 'HI', format: (_, row) => numberToString(row.hi) },
  product_or_kit: {
    id: 'product_or_kit',
    header: 'Product or Kit',
    format: (_, row) => row.product_or_kit || ''
  },
  notes: { id: 'notes', header: 'Notes', format: (_, row) => row.notes || '' },

  // Dimensiones del Producto (mm)
  product_length_mm: {
    id: 'product_length_mm',
    header: 'Product Length (mm)',
    format: (_, row) => numberToFixed2(row.product_length_mm)
  },
  product_height_mm: {
    id: 'product_height_mm',
    header: 'Product Height (mm)',
    format: (_, row) => numberToFixed2(row.product_height_mm)
  },
  product_width_mm: {
    id: 'product_width_mm',
    header: 'Product Width (mm)',
    format: (_, row) => numberToFixed2(row.product_width_mm)
  },
  product_weight_kg: {
    id: 'product_weight_kg',
    header: 'Product Weight (kg)',
    format: (_, row) => numberToFixed2(row.product_weight_kg)
  },
  product_volume_ml: {
    id: 'product_volume_ml',
    header: 'Product Volume (ml)',
    format: (_, row) => numberToFixed2(row.product_volume_ml)
  },

  // Dimensiones del Producto (in/lb/oz)
  product_length_in: {
    id: 'product_length_in',
    header: 'Product Length (in)',
    format: (_, row) => numberToFixed2(row.product_length_in)
  },
  product_height_in: {
    id: 'product_height_in',
    header: 'Product Height (in)',
    format: (_, row) => numberToFixed2(row.product_height_in)
  },
  product_width_in: {
    id: 'product_width_in',
    header: 'Product Width (in)',
    format: (_, row) => numberToFixed2(row.product_width_in)
  },
  product_weight_lb: {
    id: 'product_weight_lb',
    header: 'Product Weight (lb)',
    format: (_, row) => numberToFixed2(row.product_weight_lb)
  },
  product_volume_oz: {
    id: 'product_volume_oz',
    header: 'Product Volume (oz)',
    format: (_, row) => numberToFixed2(row.product_volume_oz)
  },

  // Dimensiones del Set
  set_length_mm: {
    id: 'set_length_mm',
    header: 'Set Length (mm)',
    format: (_, row) => numberToFixed2(row.set_length_mm)
  },
  set_height_mm: {
    id: 'set_height_mm',
    header: 'Set Height (mm)',
    format: (_, row) => numberToFixed2(row.set_height_mm)
  },
  set_width_mm: {
    id: 'set_width_mm',
    header: 'Set Width (mm)',
    format: (_, row) => numberToFixed2(row.set_width_mm)
  },
  set_weight_kg: {
    id: 'set_weight_kg',
    header: 'Set Weight (kg)',
    format: (_, row) => numberToFixed2(row.set_weight_kg)
  },
  set_weight_lb: {
    id: 'set_weight_lb',
    header: 'Set Weight (lb)',
    format: (_, row) => numberToFixed2(row.set_weight_lb)
  },
  set_length_in: {
    id: 'set_length_in',
    header: 'Set Length (in)',
    format: (_, row) => numberToFixed2(row.set_length_in)
  },
  set_height_in: {
    id: 'set_height_in',
    header: 'Set Height (in)',
    format: (_, row) => numberToFixed2(row.set_height_in)
  },
  set_width_in: {
    id: 'set_width_in',
    header: 'Set Width (in)',
    format: (_, row) => numberToFixed2(row.set_width_in)
  },

  // Dimensiones de la carton/Cartón
  carton_length_mm: {
    id: 'carton_length_mm',
    header: 'Carton Length (mm)',
    format: (_, row) => numberToFixed2(row.carton_length_mm)
  },
  carton_height_mm: {
    id: 'carton_height_mm',
    header: 'Carton Height (mm)',
    format: (_, row) => numberToFixed2(row.carton_height_mm)
  },
  carton_width_mm: {
    id: 'carton_width_mm',
    header: 'Carton Width (mm)',
    format: (_, row) => numberToFixed2(row.carton_width_mm)
  },
  carton_weight_kg: {
    id: 'carton_weight_kg',
    header: 'Carton Weight (kg)',
    format: (_, row) => numberToFixed2(row.carton_weight_kg)
  },
  carton_length_in: {
    id: 'carton_length_in',
    header: 'carton Length (in)',
    format: (_, row) => numberToFixed2(row.carton_length_in)
  },
  carton_height_in: {
    id: 'carton_height_in',
    header: 'carton Height (in)',
    format: (_, row) => numberToFixed2(row.carton_height_in)
  },
  carton_width_in: {
    id: 'carton_width_in',
    header: 'carton Width (in)',
    format: (_, row) => numberToFixed2(row.carton_width_in)
  },
  carton_weight_lb: {
    id: 'carton_weight_lb',
    header: 'Carton Weight (lb)',
    format: (_, row) => numberToFixed2(row.carton_weight_lb)
  },

  // Dimensiones y paletizado de Polybag
  pieces_per_polybag: {
    id: 'pieces_per_polybag',
    header: 'Pieces per Polybag',
    format: (_, row) => numberToString(row.pieces_per_polybag)
  },
  polybag_per_pallet: {
    id: 'polybag_per_pallet',
    header: 'Polybag per Pallet',
    format: (_, row) => numberToString(row.polybag_per_pallet)
  },
  polybag_pallet_type: {
    id: 'polybag_pallet_type',
    header: 'Polybag Pallet Type',
    format: (_, row) => row.polybag_pallet_type || ''
  },
  polybag_product_pallets_per_40hc: {
    id: 'polybag_product_pallets_per_40hc',
    header: 'Pallets Polybag per 40HC',
    format: (_, row) => numberToString(row.polybag_product_pallets_per_40hc)
  },
  polybag_product_pallets_per_45hc: {
    id: 'polybag_product_pallets_per_45hc',
    header: 'Pallets Polybag per 45HC',
    format: (_, row) => numberToString(row.polybag_product_pallets_per_45hc)
  },
  polybag_product_pallets_per_40std: {
    id: 'polybag_product_pallets_per_40std',
    header: 'Pallets Polybag per 40STD',
    format: (_, row) => numberToString(row.polybag_product_pallets_per_40std)
  },
  polybag_product_pallets_per_20std: {
    id: 'polybag_product_pallets_per_20std',
    header: 'Pallets Polybag per 20STD',
    format: (_, row) => numberToString(row.polybag_product_pallets_per_20std)
  },
  polybag_product_pallets_per_53ft: {
    id: 'polybag_product_pallets_per_53ft',
    header: 'Pallets Polybag per 53FT',
    format: (_, row) => numberToString(row.polybag_product_pallets_per_53ft)
  },
  polybag_length_mm: {
    id: 'polybag_length_mm',
    header: 'Polybag length (mm)',
    format: (_, row) => numberToFixed2(row.polybag_length_mm)
  },
  polybag_width_mm: {
    id: 'polybag_width_mm',
    header: 'Polybag WWidth (mm)',
    format: (_, row) => numberToFixed2(row.polybag_width_mm)
  },
  polybag_height_mm: {
    id: 'polybag_height_mm',
    header: 'Polybag Height(mm)',
    format: (_, row) => numberToFixed2(row.polybag_height_mm)
  },
  polybag_length_in: {
    id: 'polybag_length_in',
    header: 'Polybag Length (in)',
    format: (_, row) => numberToFixed2(row.polybag_length_in)
  },
  polybag_width_in: {
    id: 'polybag_width_in',
    header: 'Polybag Width (in)',
    format: (_, row) => numberToFixed2(row.polybag_width_in)
  },
  polybag_height_in: {
    id: 'polybag_height_in',
    header: 'Polybag Height (in)',
    format: (_, row) => numberToFixed2(row.polybag_height_in)
  },
  polybag_to_carton_length_mm: {
    id: 'polybag_to_carton_length_mm',
    header: 'Pokybag to Carton Length (mm)',
    format: (_, row) => numberToFixed2(row.polybag_to_carton_length_mm)
  },
  polybag_to_carton_width_mm: {
    id: 'polybag_to_carton_width_mm',
    header: 'Polybag to Carton width (mm)',
    format: (_, row) => numberToFixed2(row.polybag_to_carton_width_mm)
  },
  polybag_to_carton_height_mm: {
    id: 'polybag_to_carton_height_mm',
    header: 'Polybag to Carton height (mm)',
    format: (_, row) => numberToFixed2(row.polybag_to_carton_height_mm)
  },
  polybag_to_carton_length_in: {
    id: 'polybag_to_carton_length_in',
    header: 'Polybag to Carton length (in)',
    format: (_, row) => numberToFixed2(row.polybag_to_carton_length_in)
  },
  polybag_to_carton_width_in: {
    id: 'polybag_to_carton_width_in',
    header: 'Polybag to Carton width (in)',
    format: (_, row) => numberToFixed2(row.polybag_to_carton_width_in)
  },
  polybag_to_carton_height_in: {
    id: 'polybag_to_carton_height_in',
    header: 'Polybag to Carton height (in)',
    format: (_, row) => numberToFixed2(row.polybag_to_carton_height_in)
  },

  // CBM/CFT y Logística
  case_cbm: {
    id: 'case_cbm',
    header: 'CBM carton',
    format: (_, row) => numberToFixed2(row.case_cbm)
  },
  cbm_const: {
    id: 'cbm_const',
    header: 'CBM Const',
    format: (_, row) => numberToFixed2(row.cbm_const)
  },
  case_cft: {
    id: 'case_cft',
    header: 'CFT carton',
    format: (_, row) => numberToFixed2(row.case_cft)
  },
  loading_type: {
    id: 'loading_type',
    header: 'Loading Type',
    format: (_, row) => row.loading_type || ''
  },
  stacked_pallets: {
    id: 'stacked_pallets',
    header: 'Stacked Pallets',
    format: (_, row) => numberToString(row.stacked_pallets)
  },
  receiving_carton_per_pallet: {
    id: 'receiving_carton_per_pallet',
    header: 'Recieving Carton per Pallet',
    format: (_, row) => numberToString(row.receiving_carton_per_pallet)
  },

  // Códigos HTS
  hts_code: {
    id: 'hts_code',
    header: 'HTS Code',
    format: (_, row) => row.hts_code || ''
  },
  hts_duty: {
    id: 'hts_duty',
    header: 'HTS Duty',
    format: (_, row) => numberToFixed2(row.hts_duty)
  },
  hts_type: {
    id: 'hts_type',
    header: 'HTS Type',
    format: (_, row) => row.hts_type || ''
  },
  hts_product_subtype: {
    id: 'hts_product_subtype',
    header: 'HTS Product Subtype',
    format: (_, row) => row.hts_product_subtype || ''
  },

  // Costos FOB
  fob_current_cost_value: {
    id: 'fob_current_cost_value',
    header: 'Current FOB Cost',
    format: (_, row) => numberToFixed2(row.fob_current_cost_value)
  },
  fob_current_cost_start_date: {
    id: 'fob_current_cost_start_date',
    header: 'Current FOB Date',
    format: (_, row) => dateToString(row.fob_current_cost_start_date)
  },
  fob_current_cost_update_commentary: {
    id: 'fob_current_cost_update_commentary',
    header: 'Current FOB Commentary',
    format: (_, row) => row.fob_current_cost_update_commentary || ''
  },

  // Costos EXW
  exw_current_cost_value: {
    id: 'exw_current_cost_value',
    header: 'Current exw Cost Value',
    format: (_, row) => numberToFixed2(row.exw_current_cost_value)
  },
  exw_current_cost_start_date: {
    id: 'exw_current_cost_start_date',
    header: 'Current EXW Date',
    format: (_, row) => dateToString(row.exw_current_cost_start_date)
  },
  exw_current_cost_update_commentary: {
    id: 'exw_current_cost_update_commentary',
    header: 'Current EXW commentary',
    format: (_, row) => row.exw_current_cost_update_commentary || ''
  },

  // Costos DDP
  ddp_current_cost_value: {
    id: 'ddp_current_cost_value',
    header: 'Current DDP Cost Value',
    format: (_, row) => numberToFixed2(row.ddp_current_cost_value)
  },
  ddp_current_cost_start_date: {
    id: 'ddp_current_cost_start_date',
    header: 'Current DDP Date',
    format: (_, row) => dateToString(row.ddp_current_cost_start_date)
  },
  ddp_current_cost_update_commentary: {
    id: 'ddp_current_cost_update_commentary',
    header: 'Current DDP Commentary',
    format: (_, row) => row.ddp_current_cost_update_commentary || ''
  },

  // Costos CNF Diff
  cnf_diff_current_cost_value: {
    id: 'cnf_diff_current_cost_value',
    header: 'Current CNF Diff Cost Value',
    format: (_, row) => numberToFixed2(row.cnf_diff_current_cost_value)
  },
  cnf_diff_current_cost_start_date: {
    id: 'cnf_diff_current_cost_start_date',
    header: 'Current CNF Diff Date',
    format: (_, row) => dateToString(row.cnf_diff_current_cost_start_date)
  },
  cnf_diff_current_cost_update_commentary: {
    id: 'cnf_diff_current_cost_update_commentary',
    header: 'Current CNF Diff Commentary',
    format: (_, row) => row.cnf_diff_current_cost_update_commentary || ''
  },

  // Costos CNF
  cnf_current_cost_value: {
    id: 'cnf_current_cost_value',
    header: 'Current CNF Cost Value',
    format: (_, row) => numberToFixed2(row.cnf_current_cost_value)
  },
  cnf_current_cost_start_date: {
    id: 'cnf_current_cost_start_date',
    header: 'Current CNF Date',
    format: (_, row) => dateToString(row.cnf_current_cost_start_date)
  },
  cnf_current_cost_update_commentary: {
    id: 'cnf_current_cost_update_commentary',
    header: 'Current CNF Commentary',
    format: (_, row) => row.cnf_current_cost_update_commentary || ''
  },

  // Precios y Aranceles
  mrsp: {
    id: 'mrsp',
    header: 'MRSP',
    format: (_, row) => numberToFixed2(row.mrsp)
  },
  commission_percentage: {
    id: 'commission_percentage',
    header: 'Comission Percentage',
    format: (_, row) => numberToFixed2(row.commission_percentage)
  },
  commission_amount: {
    id: 'commission_amount',
    header: 'Commission Amount',
    format: (_, row) => numberToFixed2(row.commission_amount)
  },
  duty_percentage: {
    id: 'duty_percentage',
    header: 'Duty Percentage',
    format: (_, row) => numberToFixed2(row.duty_percentage)
  },
  fixed_duty_per_piece: {
    id: 'fixed_duty_per_piece',
    header: 'Fixed Duty per Piece',
    format: (_, row) => numberToFixed2(row.fixed_duty_per_piece)
  },
  duty_cost: {
    id: 'duty_cost',
    header: 'Duty Cost',
    format: (_, row) => numberToFixed2(row.duty_cost)
  },
  tariff: {
    id: 'tariff',
    header: 'Tariff',
    format: (_, row) => numberToFixed2(row.tariff)
  },
  max_carton_per_weight: {
    id: 'max_carton_per_weight',
    header: 'Max Carton per Weight',
    format: (_, row) => numberToFixed2(row.max_carton_per_weight)
  },
  max_case_pack_per_weight: {
    id: 'max_case_pack_per_weight',
    header: 'Max Case Pack per Weight',
    format: (_, row) => numberToFixed2(row.max_case_pack_per_weight)
  },

  // Optimización de Contenedores 40HC
  confirmed_carton_per_40hc: {
    id: 'confirmed_carton_per_40hc',
    header: 'Confirmed carton per 40HC',
    format: (_, row) => numberToString(row.confirmed_carton_per_40hc)
  },
  calculated_cartons_40hc_per_volume: {
    id: 'calculated_cartons_40hc_per_volume',
    header: 'Calculates cartons 40HC (Vol.)',
    format: (_, row) => numberToFixed2(row.calculated_cartons_40hc_per_volume)
  },
  calculated_case_pack_40hc_per_volume: {
    id: 'calculated_case_pack_40hc_per_volume',
    header: 'Calculated Case Pack 40HC (Vol.)',
    format: (_, row) => numberToFixed2(row.calculated_case_pack_40hc_per_volume)
  },
  optimal_cartons_per_40hc: {
    id: 'optimal_cartons_per_40hc',
    header: 'Optimal Cartons per 40HC',
    format: (_, row) => numberToFixed2(row.optimal_cartons_per_40hc)
  },
  optimal_pieces_per_40hc: {
    id: 'optimal_pieces_per_40hc',
    header: 'Optimal Pieces per 40HC',
    format: (_, row) => numberToFixed2(row.optimal_pieces_per_40hc)
  },

  // Optimización de Contenedores 45HC
  confirmed_carton_per_45hc: {
    id: 'confirmed_carton_per_45hc',
    header: 'Confirmed Cartons per 45HC',
    format: (_, row) => numberToString(row.confirmed_carton_per_45hc)
  },
  calculated_cartons_45hc_per_volume: {
    id: 'calculated_cartons_45hc_per_volume',
    header: 'Calculates Cartons 45HC (Vol.)',
    format: (_, row) => numberToFixed2(row.calculated_cartons_45hc_per_volume)
  },
  calculated_case_pack_45hc_per_volume: {
    id: 'calculated_case_pack_45hc_per_volume',
    header: 'Calculates Case Pack 45HC (Vol.)',
    format: (_, row) => numberToFixed2(row.calculated_case_pack_45hc_per_volume)
  },
  optimal_cartons_per_45hc: {
    id: 'optimal_cartons_per_45hc',
    header: 'Cartones Óptimos 45HC',
    format: (_, row) => numberToFixed2(row.optimal_cartons_per_45hc)
  },
  optimal_pieces_per_45hc: {
    id: 'optimal_pieces_per_45hc',
    header: 'Optimal Pieces per 45HC',
    format: (_, row) => numberToFixed2(row.optimal_pieces_per_45hc)
  },

  // Optimización de Contenedores 40STD
  confirmed_carton_per_40std: {
    id: 'confirmed_carton_per_40std',
    header: 'Confirmed carton per 40STD',
    format: (_, row) => numberToString(row.confirmed_carton_per_40std)
  },
  calculated_cartons_40std_per_volume: {
    id: 'calculated_cartons_40std_per_volume',
    header: 'Calculates Carton 40STD (Vol.)',
    format: (_, row) => numberToFixed2(row.calculated_cartons_40std_per_volume)
  },
  calculated_case_pack_40std_per_volume: {
    id: 'calculated_case_pack_40std_per_volume',
    header: 'Calculated Case Pack 40STD (Vol.)',
    format: (_, row) =>
      numberToFixed2(row.calculated_case_pack_40std_per_volume)
  },
  optimal_cartons_per_40std: {
    id: 'optimal_cartons_per_40std',
    header: 'Optimal Cartons per 40STD',
    format: (_, row) => numberToFixed2(row.optimal_cartons_per_40std)
  },
  optimal_pieces_per_40std: {
    id: 'optimal_pieces_per_40std',
    header: 'Optimal Pieces per 40STD',
    format: (_, row) => numberToFixed2(row.optimal_pieces_per_40std)
  },

  // Optimización de Contenedores 20STD
  confirmed_carton_per_20std: {
    id: 'confirmed_carton_per_20std',
    header: 'Confirmed Cartons per 20STD',
    format: (_, row) => numberToString(row.confirmed_carton_per_20std)
  },
  calculated_cartons_20std_per_volume: {
    id: 'calculated_cartons_20std_per_volume',
    header: 'Calculated Cartons 20STD (Vol.)',
    format: (_, row) => numberToFixed2(row.calculated_cartons_20std_per_volume)
  },
  calculated_case_pack_20std_per_volume: {
    id: 'calculated_case_pack_20std_per_volume',
    header: 'Calculated Case Pack 20STD (Vol.)',
    format: (_, row) =>
      numberToFixed2(row.calculated_case_pack_20std_per_volume)
  },
  optimal_cartons_per_20std: {
    id: 'optimal_cartons_per_20std',
    header: 'Optimal Cartons 20STD',
    format: (_, row) => numberToFixed2(row.optimal_cartons_per_20std)
  },
  optimal_pieces_per_20std: {
    id: 'optimal_pieces_per_20std',
    header: 'Optimal Pieces 20STD',
    format: (_, row) => numberToFixed2(row.optimal_pieces_per_20std)
  },

  // 53FT Optimization
  confirmed_carton_per_53ft: {
    id: 'confirmed_carton_per_53ft',
    header: 'Confirmed Cartons per 53FT',
    format: (_, row) => numberToString(row.confirmed_carton_per_53ft)
  },
  calculated_cartons_53ft_per_volume: {
    id: 'calculated_cartons_53ft_per_volume',
    header: 'Calculated Cartons 53FT (Vol.)',
    format: (_, row) => numberToFixed2(row.calculated_cartons_53ft_per_volume)
  },
  calculated_case_pack_53ft_per_volume: {
    id: 'calculated_case_pack_53ft_per_volume',
    header: 'Calculated Case Pack 53FT (Vol.)',
    format: (_, row) => numberToFixed2(row.calculated_case_pack_53ft_per_volume)
  },
  optimal_cartons_per_53ft: {
    id: 'optimal_cartons_per_53ft',
    header: 'Optimal Cartons 53FT',
    format: (_, row) => numberToFixed2(row.optimal_cartons_per_53ft)
  },
  optimal_pieces_per_53ft: {
    id: 'optimal_pieces_per_53ft',
    header: 'Optimal Pieces 53FT',
    format: (_, row) => numberToFixed2(row.optimal_pieces_per_53ft)
  },

  // Logistic Costs
  logistic_cost_40hc: {
    id: 'logistic_cost_40hc',
    header: 'Logistic Cost 40HC',
    format: (_, row) => numberToFixed2(row.logistic_cost_40hc)
  },
  logistic_cost_45hc: {
    id: 'logistic_cost_45hc',
    header: 'Logistic Cost 45HC',
    format: (_, row) => numberToFixed2(row.logistic_cost_45hc)
  },
  logistic_cost_40std: {
    id: 'logistic_cost_40std',
    header: 'Logistic Cost 40STD',
    format: (_, row) => numberToFixed2(row.logistic_cost_40std)
  },
  logistic_cost_20std: {
    id: 'logistic_cost_20std',
    header: 'Logistic Cost 20STD',
    format: (_, row) => numberToFixed2(row.logistic_cost_20std)
  },
  logistic_cost_53ft: {
    id: 'logistic_cost_53ft',
    header: 'Logistic Cost 53FT',
    format: (_, row) => numberToFixed2(row.logistic_cost_53ft)
  },

  // Landed Costs
  landed_cost_40hc: {
    id: 'landed_cost_40hc',
    header: 'Landed Cost 40HC',
    format: (_, row) => numberToFixed2(row.landed_cost_40hc)
  },
  landed_cost_45hc: {
    id: 'landed_cost_45hc',
    header: 'Landed Cost 45HC',
    format: (_, row) => numberToFixed2(row.landed_cost_45hc)
  },
  landed_cost_40std: {
    id: 'landed_cost_40std',
    header: 'Landed Cost 40STD',
    format: (_, row) => numberToFixed2(row.landed_cost_40std)
  },
  landed_cost_20std: {
    id: 'landed_cost_20std',
    header: 'Landed Cost 20STD',
    format: (_, row) => numberToFixed2(row.landed_cost_20std)
  },
  landed_cost_53ft: {
    id: 'landed_cost_53ft',
    header: 'Landed Cost 53FT',
    format: (_, row) => numberToFixed2(row.landed_cost_53ft)
  },

  // Image & Avg Cost
  image_path: {
    id: 'image_path',
    header: 'Image',
    image: {
      getUrl: (row) =>
        row.image_path ? resolveProductImageUrl(row.image_path) : null,
      width: 100,
      height: 100
    }
  },
  average_cost: {
    id: 'average_cost',
    header: 'Average Cost',
    format: (_, row) =>
      typeof row.average_cost === 'number'
        ? row.average_cost
        : row.average_cost || ''
  },

  // Inventory — headers replaced by actual dates
  inventory_today: {
    id: 'inventory_today',
    header: today,
    format: (_, row) => numberToFixed2(row.inventory_today)
  },
  inventory_today_7: {
    id: 'inventory_today_7',
    header: plus7,
    format: (_, row) => numberToFixed2(row.inventory_today_7)
  },
  inventory_today_14: {
    id: 'inventory_today_14',
    header: plus14,
    format: (_, row) => numberToFixed2(row.inventory_today_14)
  },
  inventory_today_21: {
    id: 'inventory_today_21',
    header: plus21,
    format: (_, row) => numberToFixed2(row.inventory_today_21)
  },
  inventory_today_49: {
    id: 'inventory_today_49',
    header: plus49,
    format: (_, row) => numberToFixed2(row.inventory_today_49)
  },
  inventory_today_77: {
    id: 'inventory_today_77',
    header: plus77,
    format: (_, row) => numberToFixed2(row.inventory_today_77)
  },
  inventory_today_105: {
    id: 'inventory_today_105',
    header: plus105,
    format: (_, row) => numberToFixed2(row.inventory_today_105)
  }
};

export const downloadProducts = authActionClient
  .metadata({ actionName: 'downloadProducts' })
  .inputSchema(downloadProductsViewSchema)
  .action(async ({ parsedInput }) => {
    const {
      columns,
      ids,
      search,
      category,
      sortBy,
      sortDirection,

      stock,
      vendor,
      brand_name,
      consumer_use,
      product_collection,
      raw_material,
      season,
      set_collection,
      status
    } = parsedInput;

    // 1. Obtener datos filtrados usando TODOS los filtros disponibles
    const { products } = await getProductsView({
      page: 1,
      limit: 10000,

      // filtros simples
      search,
      category,
      sortBy,
      sortDirection,
      ids,
      columns,

      // filtros adicionales
      stock,
      vendor,
      brand_name,
      consumer_use,
      product_collection,
      raw_material,
      season,
      set_collection,
      status
    });

    // 2. Mapear las columnas seleccionadas a sus configuraciones
    // Nota: El tipo de 'columns' en 'parsedInput' debe coincidir con 'keyof ProductView'
    const columnConfigs: ExcelColumnConfig<ProductsViewTable>[] =
      (columns as (keyof ProductsViewTable)[])
        ?.map((col) => COLUMN_CONFIGS[col])
        .filter(
          (config): config is ExcelColumnConfig<ProductsViewTable> => !!config
        ) ?? [];

    // Si no se seleccionaron columnas, puedes optar por descargar todas o un conjunto predeterminado
    const finalColumnConfigs =
      columnConfigs.length > 0
        ? columnConfigs
        : Object.values(COLUMN_CONFIGS).slice(0, 10); // Ejemplo: Descargar las primeras 10 por defecto

    // 3. Crear el archivo Excel
    const base64 = await createExcelBase64({
      sheetName: 'ProductView',
      columns: finalColumnConfigs,
      data: products
    });
    const timestamp = new Date()
      .toISOString()
      .slice(0, 19) // "2025-02-11T14:32:08"
      .replace('T', '_') // "2025-02-11_14:32:08"
      .replace(/:/g, '-'); // "2025-02-11_14-32-08"
    return {
      base64,
      filename: `product_view_${timestamp}.xlsx`,
      mimeType: EXCEL_DEFAULT_MIME_TYPE
    };
  });
