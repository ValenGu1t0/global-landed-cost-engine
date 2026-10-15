export const COLUMN_GROUPS = {
  default: {
    label: 'Default',
    columns: [
      'hemicode',
      'status',
      'factory_code',
      'factory_mold',
      'item_upc',
      'case_upc',
      'origin_country',
      'vendor',
      'brand_name',
      'pre_price',
      'factory_name',
      'description',
      'short_description',
      'notes'
    ]
  },

  category: {
    label: 'Category',
    columns: ['super_category', 'category', 'sub_category']
  },

  attributes: {
    label: 'Atributes',
    columns: [
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
    label: 'Pieces',
    columns: [
      'pieces_per_unit',
      'case_pack',
      'pieces_per_carton',
      'pieces_per_polybag',
      'polybag_per_pallet'
    ]
  },

  incoterm: {
    label: 'Incoterm',
    columns: [
      'fob_current_cost_value',
      'fob_current_cost_start_date',
      'fob_current_cost_update_commentary',
      'exw_current_cost_value',
      'exw_current_cost_start_date',
      'exw_current_cost_update_commentary',
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

  product_dimensions_metric: {
    label: 'Product Dimensions (Metric)',
    columns: [
      'product_length_mm',
      'product_width_mm',
      'product_height_mm',
      'product_weight_kg',
      'product_volume_ml'
    ]
  },

  product_dimensions_imperial: {
    label: 'Product Dimensions (Imperial)',
    columns: [
      'product_length_inches',
      'product_width_inches',
      'product_height_inches',
      'product_weight_lb',
      'product_volume_oz'
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
      'polybag_to_case_length_mm',
      'polybag_to_case_width_mm',
      'polybag_to_case_height_mm'
    ]
  },

  polybag_dimensions_imperial: {
    label: 'Polybag Dimensions (Imperial)',
    columns: [
      'polybag_length_in',
      'polybag_width_in',
      'polybag_height_in',
      'polybag_to_case_length_in',
      'polybag_to_case_width_in',
      'polybag_to_case_height_in'
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
    label: 'Logistic Costs',
    columns: [
      'logistic_cost_20std',
      'logistic_cost_40hc',
      'logistic_cost_45hc',
      'logistic_cost_40std',
      'logistic_cost_53ft'
    ]
  },

  duty: {
    label: 'Duty',
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

  landing_costs: {
    label: 'Landing Costs',
    columns: [
      'landing_cost_40hc',
      'landing_cost_45hc',
      'landing_cost_40std',
      'landing_cost_20std',
      'landing_cost_53ft'
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
    label: 'Logistics',
    columns: [
      'max_carton_per_weight',
      'max_case_pack_per_weight',
      'confirmed_carton_per_40hc',
      'calculated_cartons_40hc_per_volume',
      'calculated_case_pack_40hc_per_volume',
      'optimal_cartons_40hc',
      'optimal_case_pack_40hc',
      'confirmed_carton_per_45hc',
      'calculated_cartons_45hc_per_volume',
      'calculated_case_pack_45hc_per_volume',
      'optimal_cartons_45hc',
      'optimal_case_pack_45hc',
      'confirmed_carton_per_40std',
      'calculated_cartons_40std_per_volume',
      'calculated_case_pack_40std_per_volume',
      'optimal_cartons_per_40std',
      'optimal_case_pack_40std',
      'confirmed_carton_per_20std',
      'calculated_cartons_20std_per_volume',
      'calculated_case_pack_20std_per_volume',
      'optimal_cartons_20std',
      'optimal_case_pack_per_20std',
      'confirmed_carton_per_53ft',
      'calculated_cartons_53ft_per_volume',
      'calculated_case_pack_53ft_per_volume',
      'optimal_cartons_53ft',
      'optimal_case_pack_53ft'
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
  },

  landed_costs: {
    label: 'Landed Costs',
    columns: [
      'landed_cost_40hc',
      'landed_cost_45hc',
      'landed_cost_40std',
      'landed_cost_20std',
      'landed_cost_53ft'
    ]
  },

  optimal_pieces: {
    label: 'Optimal Pieces',
    columns: [
      'optimal_cartons_per_40hc',
      'optimal_pieces_per_40hc',
      'optimal_cartons_per_45hc',
      'optimal_pieces_per_45hc',
      'optimal_cartons_per_40std',
      'optimal_pieces_per_40std',
      'optimal_cartons_per_20std',
      'optimal_pieces_per_20std',
      'optimal_cartons_per_53ft',
      'optimal_pieces_per_53ft'
    ]
  },

  polybag_to_carton: {
    label: 'Polybag to Carton',
    columns: [
      'polybag_to_carton_length_mm',
      'polybag_to_carton_width_mm',
      'polybag_to_carton_height_mm',
      'polybag_to_carton_length_in',
      'polybag_to_carton_width_in',
      'polybag_to_carton_height_in'
    ]
  },

  product_dimmensions_imperial: {
    label: 'Product Dimmensions (Imperial)',
    columns: ['product_length_in', 'product_height_in', 'product_width_in']
  }
} as const;
