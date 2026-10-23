export const COLUMN_GROUPS = {
  default: {
    label: 'Default (Trade & Landed Overview)',
    columns: [
      'cn_code',
      'status',
      'origin_country',
      'vendor',
      'brand_name',
      'description',
      // Product Dimensions (cm & inches)
      'product_length_cm',
      'product_width_cm',
      'product_height_cm',
      'product_length_in',
      'product_width_in',
      'product_height_in',
      // 5 Base Incoterms
      'exw_current_cost_value',
      'fob_current_cost_value',
      'cnf_current_cost_value',
      'cnf_diff_current_cost_value',
      'ddp_current_cost_value',
      // 5 Destination Country Landed Prices
      'landed_cost_usa',
      'landed_cost_canada',
      'landed_cost_france',
      'landed_cost_morocco',
      'landed_cost_israel',
      'mrsp'
    ]
  },

  incoterm: {
    label: 'Incoterms (EXW, FOB, CNF, CNF Diff, DDP)',
    columns: [
      'exw_current_cost_value',
      'exw_current_cost_start_date',
      'exw_current_cost_update_commentary',
      'fob_current_cost_value',
      'fob_current_cost_start_date',
      'fob_current_cost_update_commentary',
      'cnf_current_cost_value',
      'cnf_current_cost_start_date',
      'cnf_current_cost_update_commentary',
      'cnf_diff_current_cost_value',
      'cnf_diff_current_cost_start_date',
      'cnf_diff_current_cost_update_commentary',
      'ddp_current_cost_value',
      'ddp_current_cost_start_date',
      'ddp_current_cost_update_commentary',
      'mrsp'
    ]
  },

  destination_landed_costs: {
    label: 'Landed Costs by Country (USA, CAN, FRA, MAR, ISR)',
    columns: [
      'landed_cost_usa',
      'landed_cost_canada',
      'landed_cost_france',
      'landed_cost_morocco',
      'landed_cost_israel'
    ]
  },

  product_dimensions_metric: {
    label: 'Product Dimensions (cm & mm)',
    columns: [
      'product_length_cm',
      'product_width_cm',
      'product_height_cm',
      'product_length_mm',
      'product_width_mm',
      'product_height_mm',
      'product_weight_kg',
      'product_volume_ml'
    ]
  },

  product_dimensions_imperial: {
    label: 'Product Dimensions (Inches & lb)',
    columns: [
      'product_length_in',
      'product_width_in',
      'product_height_in',
      'product_weight_lb',
      'product_volume_oz'
    ]
  },

  category: {
    label: 'Category',
    columns: ['super_category', 'category', 'sub_category']
  },

  attributes: {
    label: 'Attributes & Factory Codes',
    columns: [
      'factory_code',
      'factory_mold',
      'item_upc',
      'case_upc',
      'pre_price',
      'factory_name',
      'short_description',
      'notes',
      'consumer_use',
      'set_collection',
      'product_collection',
      'process_type',
      'season',
      'color_family',
      'color_description',
      'pantone_code',
      'tosaf_code',
      'raw_material',
      'finishing',
      'packing',
      'shipping_pack',
      'label',
      'product_or_kit'
    ]
  },

  pieces: {
    label: 'Pieces & Packaging',
    columns: [
      'pieces_per_unit',
      'case_pack',
      'pieces_per_carton',
      'pieces_per_polybag',
      'polybag_per_pallet'
    ]
  },

  carton_dimensions_metric: {
    label: 'Carton Dimensions (Metric)',
    columns: [
      'carton_length_mm',
      'carton_width_mm',
      'carton_height_mm',
      'carton_weight_kg'
    ]
  },

  carton_dimensions_imperial: {
    label: 'Carton Dimensions (Imperial)',
    columns: [
      'carton_length_in',
      'carton_width_in',
      'carton_height_in',
      'carton_weight_lb',
      'case_cbm',
      'cbm_const',
      'case_cft'
    ]
  },

  set_dimensions_metric: {
    label: 'Set Dimensions (Metric)',
    columns: ['set_length_mm', 'set_width_mm', 'set_height_mm', 'set_weight_kg']
  },

  set_dimensions_imperial: {
    label: 'Set Dimensions (Imperial)',
    columns: ['set_length_in', 'set_width_in', 'set_height_in', 'set_weight_lb']
  },

  polybag_dimensions_metric: {
    label: 'Polybag Dimensions (Metric)',
    columns: [
      'polybag_length_mm',
      'polybag_width_mm',
      'polybag_height_mm',
      'polybag_to_carton_length_mm',
      'polybag_to_carton_width_mm',
      'polybag_to_carton_height_mm'
    ]
  },

  polybag_dimensions_imperial: {
    label: 'Polybag Dimensions (Imperial)',
    columns: [
      'polybag_length_in',
      'polybag_width_in',
      'polybag_height_in',
      'polybag_to_carton_length_in',
      'polybag_to_carton_width_in',
      'polybag_to_carton_height_in'
    ]
  },

  receiving: {
    label: 'Receiving',
    columns: ['loading_type', 'receiving_carton_per_pallet', 'stacked_pallets']
  },

  commission: {
    label: 'Commission',
    columns: ['commission_percentage', 'commission_amount']
  },

  logistic_cost: {
    label: 'Logistic Costs (Containers)',
    columns: [
      'logistic_cost_20std',
      'logistic_cost_40hc',
      'logistic_cost_45hc',
      'logistic_cost_40std',
      'logistic_cost_53ft'
    ]
  },

  duty: {
    label: 'Duty & HTS',
    columns: [
      'tariff',
      'duty_percentage',
      'fixed_duty_per_piece',
      'duty_cost',
      'hts_duty',
      'hts_type',
      'hts_product_subtype',
      'hts_code'
    ]
  },

  landed_costs: {
    label: 'Landed Costs (Containers)',
    columns: [
      'landed_cost_40hc',
      'landed_cost_45hc',
      'landed_cost_40std',
      'landed_cost_20std',
      'landed_cost_53ft'
    ]
  },

  polybag_product_pallets: {
    label: 'Polybag Product Pallets',
    columns: [
      'polybag_product_pallets_per_40hc',
      'polybag_product_pallets_per_45hc',
      'polybag_product_pallets_per_40std',
      'polybag_product_pallets_per_20std',
      'polybag_product_pallets_per_53ft',
      'polybag_pallet_type'
    ]
  },

  logistics_optimization: {
    label: 'Container Capacity Optimization',
    columns: [
      'max_carton_per_weight',
      'max_case_pack_per_weight',
      'confirmed_carton_per_40hc',
      'calculated_cartons_40hc_per_volume',
      'calculated_case_pack_40hc_per_volume',
      'optimal_cartons_per_40hc',
      'optimal_pieces_per_40hc',
      'confirmed_carton_per_45hc',
      'calculated_cartons_45hc_per_volume',
      'calculated_case_pack_45hc_per_volume',
      'optimal_cartons_per_45hc',
      'optimal_pieces_per_45hc',
      'confirmed_carton_per_40std',
      'calculated_cartons_40std_per_volume',
      'calculated_case_pack_40std_per_volume',
      'optimal_cartons_per_40std',
      'optimal_pieces_per_40std',
      'confirmed_carton_per_20std',
      'calculated_cartons_20std_per_volume',
      'calculated_case_pack_20std_per_volume',
      'optimal_cartons_per_20std',
      'optimal_pieces_per_20std',
      'confirmed_carton_per_53ft',
      'calculated_cartons_53ft_per_volume',
      'calculated_case_pack_53ft_per_volume',
      'optimal_cartons_per_53ft',
      'optimal_pieces_per_53ft'
    ]
  },

  inventory_availability: {
    label: 'Inventory Availability',
    columns: [
      'inventory_today',
      'inventory_today_7',
      'inventory_today_14',
      'inventory_today_21',
      'inventory_today_49',
      'inventory_today_77',
      'inventory_today_105',
      'average_cost'
    ]
  },

  crt_pal: {
    label: 'CRT/PAL',
    columns: [
      'estimated_carton_per_american_pallet',
      'ti',
      'hi',
      'carton_per_american_pallet'
    ]
  }
} as const;
