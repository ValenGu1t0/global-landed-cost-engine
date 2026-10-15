import {
  pgTable,
  serial,
  text,
  varchar,
  real,
  timestamp,
  unique,
  numeric,
  integer,
  boolean,
  doublePrecision,
  primaryKey,
  index
} from 'drizzle-orm/pg-core';

/* PRODUCT VIEW TABLE */
export const productViewTable = pgTable('product_view_table', {
  tech_sku_id: integer('tech_sku_id').primaryKey(),
  hemicode: varchar('hemicode', { length: 30 }),
  status: varchar('status', { length: 20 }),

  image_in_process: boolean('image_in_process'),
  factory_code: varchar('factory_code', { length: 50 }),
  factory_mold: varchar('factory_mold', { length: 50 }),
  item_upc: varchar('item_upc', { length: 200 }),
  case_upc: varchar('case_upc', { length: 20 }),
  vendor: varchar('vendor', { length: 50 }),
  brand_name: varchar('brand_name', { length: 50 }),
  origin_country: varchar('origin_country', { length: 50 }),
  pre_price: boolean('pre_price'),
  factory_name: varchar('factory_name', { length: 50 }),
  description: varchar('description', { length: 400 }),
  short_description: varchar('short_description', { length: 100 }),
  super_category: varchar('super_category', { length: 30 }),
  category: varchar('category', { length: 50 }),
  sub_category: varchar('sub_category', { length: 30 }),
  consumer_use: varchar('consumer_use', { length: 30 }),
  set_collection: varchar('set_collection', { length: 30 }),
  product_collection: varchar('product_collection', { length: 30 }),
  process_type: varchar('process_type', { length: 30 }),
  season: varchar('season', { length: 30 }),
  color_family: varchar('color_family', { length: 30 }),
  color_description: varchar('color_description', { length: 200 }),
  pantone_code: varchar('pantone_code', { length: 200 }),
  tosaf_code: varchar('tosaf_code', { length: 200 }),
  raw_material: varchar('raw_material', { length: 50 }),
  finishing: varchar('finishing', { length: 30 }),
  shipping_pack: varchar('shipping_pack', { length: 30 }),
  label: varchar('label', { length: 200 }),
  packing: varchar('packing', { length: 30 }),

  pieces_per_unit: integer('pieces_per_unit'),
  case_pack: integer('case_pack'),
  pieces_per_carton: integer('pieces_per_carton'),
  carton_per_american_pallet: integer('carton_per_american_pallet'),
  estimated_carton_per_american_pallet: real(
    'estimated_carton_per_american_pallet'
  ),

  ti: integer('ti'),
  hi: integer('hi'),

  product_or_kit: varchar('product_or_kit', { length: 30 }),
  notes: varchar('notes', { length: 250 }),

  product_length_mm: real('product_length_mm'),
  product_height_mm: real('product_height_mm'),
  product_width_mm: real('product_width_mm'),
  product_weight_kg: real('product_weight_kg'),
  product_volume_ml: real('product_volume_ml'),

  product_length_in: real('product_length_in'),
  product_height_in: real('product_height_in'),
  product_width_in: real('product_width_in'),
  product_weight_lb: real('product_weight_lb'),
  product_volume_oz: real('product_volume_oz'),

  set_length_mm: real('set_length_mm'),
  set_height_mm: real('set_height_mm'),
  set_width_mm: real('set_width_mm'),
  set_weight_kg: real('set_weight_kg'),
  set_weight_lb: real('set_weight_lb'),
  set_length_in: real('set_length_in'),
  set_height_in: real('set_height_in'),
  set_width_in: real('set_width_in'),

  carton_length_mm: real('carton_length_mm'),
  carton_height_mm: real('carton_height_mm'),
  carton_width_mm: real('carton_width_mm'),
  carton_weight_kg: real('carton_weight_kg'),

  carton_length_in: real('carton_length_in'),
  carton_height_in: real('carton_height_in'),
  carton_width_in: real('carton_width_in'),
  carton_weight_lb: real('carton_weight_lb'),

  pieces_per_polybag: integer('pieces_per_polybag'),
  polybag_per_pallet: integer('polybag_per_pallet'),
  polybag_pallet_type: varchar('polybag_pallet_type', { length: 10 }),

  polybag_product_pallets_per_40hc: integer('polybag_product_pallets_per_40hc'),
  polybag_product_pallets_per_45hc: integer('polybag_product_pallets_per_45hc'),
  polybag_product_pallets_per_40std: integer(
    'polybag_product_pallets_per_40std'
  ),
  polybag_product_pallets_per_20std: integer(
    'polybag_product_pallets_per_20std'
  ),
  polybag_product_pallets_per_53ft: integer('polybag_product_pallets_per_53ft'),

  polybag_length_mm: real('polybag_length_mm'),
  polybag_width_mm: real('polybag_width_mm'),
  polybag_height_mm: real('polybag_height_mm'),
  polybag_length_in: real('polybag_length_in'),
  polybag_width_in: real('polybag_width_in'),
  polybag_height_in: real('polybag_height_in'),

  polybag_to_carton_length_mm: real('polybag_to_carton_length_mm'),
  polybag_to_carton_width_mm: real('polybag_to_carton_width_mm'),
  polybag_to_carton_height_mm: real('polybag_to_carton_height_mm'),

  polybag_to_carton_length_in: real('polybag_to_carton_length_in'),
  polybag_to_carton_width_in: real('polybag_to_carton_width_in'),
  polybag_to_carton_height_in: real('polybag_to_carton_height_in'),

  case_cbm: real('case_cbm'),
  cbm_const: real('cbm_const'),
  case_cft: real('case_cft'),

  loading_type: varchar('loading_type', { length: 30 }),
  stacked_pallets: integer('stacked_pallets'),
  receiving_carton_per_pallet: integer('receiving_carton_per_pallet'),

  hts_code: varchar('hts_code', { length: 12 }),
  hts_duty: real('hts_duty'),
  hts_type: varchar('hts_type', { length: 10 }),
  hts_product_subtype: varchar('hts_product_subtype', { length: 200 }),

  fob_current_cost_value: real('fob_current_cost_value'),
  fob_current_cost_start_date: timestamp('fob_current_cost_start_date'),
  fob_current_cost_update_commentary: varchar(
    'fob_current_cost_update_commentary',
    { length: 200 }
  ),

  exw_current_cost_value: real('exw_current_cost_value'),
  exw_current_cost_start_date: timestamp('exw_current_cost_start_date'),
  exw_current_cost_update_commentary: varchar(
    'exw_current_cost_update_commentary',
    { length: 200 }
  ),

  ddp_current_cost_value: real('ddp_current_cost_value'),
  ddp_current_cost_start_date: timestamp('ddp_current_cost_start_date'),
  ddp_current_cost_update_commentary: varchar(
    'ddp_current_cost_update_commentary',
    { length: 200 }
  ),

  cnf_diff_current_cost_value: real('cnf_diff_current_cost_value'),
  cnf_diff_current_cost_start_date: timestamp(
    'cnf_diff_current_cost_start_date'
  ),
  cnf_diff_current_cost_update_commentary: varchar(
    'cnf_diff_current_cost_update_commentary',
    { length: 200 }
  ),

  cnf_current_cost_value: real('cnf_current_cost_value'),
  cnf_current_cost_start_date: timestamp('cnf_current_cost_start_date'),
  cnf_current_cost_update_commentary: varchar(
    'cnf_current_cost_update_commentary',
    { length: 200 }
  ),

  mrsp: real('mrsp'),
  commission_percentage: real('commission_percentage'),
  commission_amount: real('commission_amount'),
  duty_percentage: real('duty_percentage'),
  fixed_duty_per_piece: real('fixed_duty_per_piece'),
  duty_cost: real('duty_cost'),
  tariff: real('tariff'),
  max_carton_per_weight: real('max_carton_per_weight'),
  max_case_pack_per_weight: real('max_case_pack_per_weight'),

  confirmed_carton_per_40hc: integer('confirmed_carton_per_40hc'),
  calculated_cartons_40hc_per_volume: real(
    'calculated_cartons_40hc_per_volume'
  ),
  calculated_case_pack_40hc_per_volume: real(
    'calculated_case_pack_40hc_per_volume'
  ),
  optimal_cartons_per_40hc: real('optimal_cartons_per_40hc'),
  optimal_pieces_per_40hc: real('optimal_pieces_per_40hc'),

  confirmed_carton_per_45hc: integer('confirmed_carton_per_45hc'),
  calculated_cartons_45hc_per_volume: real(
    'calculated_cartons_45hc_per_volume'
  ),
  calculated_case_pack_45hc_per_volume: real(
    'calculated_case_pack_45hc_per_volume'
  ),
  optimal_cartons_per_45hc: real('optimal_cartons_per_45hc'),
  optimal_pieces_per_45hc: real('optimal_pieces_per_45hc'),

  confirmed_carton_per_40std: integer('confirmed_carton_per_40std'),
  calculated_cartons_40std_per_volume: real(
    'calculated_cartons_40std_per_volume'
  ),
  calculated_case_pack_40std_per_volume: real(
    'calculated_case_pack_40std_per_volume'
  ),
  optimal_cartons_per_40std: real('optimal_cartons_per_40std'),
  optimal_pieces_per_40std: real('optimal_pieces_per_40std'),

  confirmed_carton_per_20std: integer('confirmed_carton_per_20std'),
  calculated_cartons_20std_per_volume: real(
    'calculated_cartons_20std_per_volume'
  ),
  calculated_case_pack_20std_per_volume: real(
    'calculated_case_pack_20std_per_volume'
  ),
  optimal_cartons_per_20std: real('optimal_cartons_per_20std'),
  optimal_pieces_per_20std: real('optimal_pieces_per_20std'),

  confirmed_carton_per_53ft: integer('confirmed_carton_per_53ft'),
  calculated_cartons_53ft_per_volume: real(
    'calculated_cartons_53ft_per_volume'
  ),
  calculated_case_pack_53ft_per_volume: real(
    'calculated_case_pack_53ft_per_volume'
  ),
  optimal_cartons_per_53ft: real('optimal_cartons_per_53ft'),
  optimal_pieces_per_53ft: real('optimal_pieces_per_53ft'),

  logistic_cost_40hc: real('logistic_cost_40hc'),
  logistic_cost_45hc: real('logistic_cost_45hc'),
  logistic_cost_40std: real('logistic_cost_40std'),
  logistic_cost_20std: real('logistic_cost_20std'),
  logistic_cost_53ft: real('logistic_cost_53ft'),

  landed_cost_40hc: real('landed_cost_40hc'),
  landed_cost_45hc: real('landed_cost_45hc'),
  landed_cost_40std: real('landed_cost_40std'),
  landed_cost_20std: real('landed_cost_20std'),
  landed_cost_53ft: real('landed_cost_53ft'),

  image_path: varchar('image_path', { length: 255 }),

  average_cost: numeric('average_cost', { precision: 28, scale: 9 }),

  inventory_today: real('inventory_today'),
  inventory_today_7: real('inventory_today_7'),
  inventory_today_14: real('inventory_today_14'),
  inventory_today_21: real('inventory_today_21'),
  inventory_today_49: real('inventory_today_49'),
  inventory_today_77: real('inventory_today_77'),
  inventory_today_105: real('inventory_today_105')
});

/* PRODUCT TABLE REAL */
export const productTable = pgTable('product', {
  tech_sku_id: serial('tech_sku_id').primaryKey(),

  hts_category: varchar('hts_category', { length: 7 }),
  hemicode: varchar('hemicode', { length: 30 }).unique(),

  status: varchar('status', { length: 20 }).notNull(),
  factory_code: varchar('factory_code', { length: 50 }),
  factory_mold: varchar('factory_mold', { length: 50 }),
  item_upc: varchar('item_upc', { length: 200 }),
  case_upc: varchar('case_upc', { length: 20 }),
  origin_country: varchar('origin_country', { length: 50 }).notNull(),
  vendor: varchar('vendor', { length: 50 }).notNull(),
  brand_name: varchar('brand_name', { length: 50 }).notNull(),
  factory_name: varchar('factory_name', { length: 50 }).notNull(),
  description: varchar('description', { length: 400 }).notNull(),
  short_description: varchar('short_description', { length: 100 }),

  super_category: varchar('super_category', { length: 30 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  sub_category: varchar('sub_category', { length: 30 }),
  consumer_use: varchar('consumer_use', { length: 30 }),
  set_collection: varchar('set_collection', { length: 30 }),
  product_collection: varchar('product_collection', { length: 30 }),
  process_type: varchar('process_type', { length: 30 }),
  season: varchar('season', { length: 30 }),

  color_family: varchar('color_family', { length: 30 }),
  color_description: varchar('color_description', { length: 200 }),
  tosaf_code: varchar('tosaf_code', { length: 200 }),
  pantone_code: varchar('pantone_code', { length: 200 }),

  raw_material: varchar('raw_material', { length: 50 }),
  finishing: varchar('finishing', { length: 30 }),
  packing: varchar('packing', { length: 30 }).notNull(),
  shipping_pack: varchar('shipping_pack', { length: 30 }),
  label: varchar('label', { length: 200 }),

  pieces_per_unit: integer('pieces_per_unit').notNull(),
  case_pack: integer('case_pack').notNull(),
  receiving_carton_per_pallet: integer('receiving_carton_per_pallet'),
  ti: integer('ti'),
  hi: integer('hi'),

  fob: real('fob'),
  exw: real('exw'),
  cnf: real('cnf'),
  ddp: real('ddp'),

  product_length_mm: real('product_length_mm'),
  product_width_mm: real('product_width_mm'),
  product_height_mm: real('product_height_mm'),
  product_weight_kg: real('product_weight_kg'),
  product_volume_ml: real('product_volume_ml'),

  carton_length_mm: real('carton_length_mm'),
  carton_width_mm: real('carton_width_mm'),
  carton_height_mm: real('carton_height_mm'),

  pieces_per_polybag: integer('pieces_per_polybag'),
  polybag_per_pallet: integer('polybag_per_pallet'),
  carton_weight_kg: real('carton_weight_kg'),

  vendor_pallet_lenght: real('vendor_pallet_lenght'),
  vendor_pallet_width: real('vendor_pallet_width'),

  commission_percentage: real('commission_percentage'),
  stacked_pallets: integer('stacked_pallets'),

  pre_price: boolean('pre_price'),
  carton_per_american_pallet: integer('carton_per_american_pallet'),
  cnf_diff: real('cnf_diff'),

  loading_type: varchar('loading_type', { length: 30 }),
  hts_product_subtype: varchar('hts_product_subtype', { length: 200 }),

  polybag_to_carton_length_mm: real('polybag_to_carton_length_mm'),
  polybag_to_carton_width_mm: real('polybag_to_carton_width_mm'),
  polybag_to_carton_height_mm: real('polybag_to_carton_height_mm'),

  polybag_product_pallets_per_40hc: integer('polybag_product_pallets_per_40hc'),
  polybag_length_mm: real('polybag_length_mm'),
  polybag_width_mm: real('polybag_width_mm'),
  polybag_height_mm: real('polybag_height_mm'),

  set_length_mm: real('set_length_mm'),
  set_width_mm: real('set_width_mm'),
  set_height_mm: real('set_height_mm'),

  notes: varchar('notes', { length: 250 }),

  polybag_product_pallets_per_53ft: integer('polybag_product_pallets_per_53ft'),
  polybag_pallet_type: varchar('polybag_pallet_type', { length: 10 }),

  mrsp: real('mrsp'),
  cbm: real('cbm'),
  cbm_const: real('cbm_const').notNull().default(0),
  product_or_kit: varchar('product_or_kit', { length: 30 })
    .notNull()
    .default('PRODUCT'),

  confirmed_carton_per_40hc: integer('confirmed_carton_per_40hc'),
  confirmed_carton_per_45hc: integer('confirmed_carton_per_45hc'),
  confirmed_carton_per_40std: integer('confirmed_carton_per_40std'),
  confirmed_carton_per_20std: integer('confirmed_carton_per_20std'),
  confirmed_carton_per_53ft: integer('confirmed_carton_per_53ft'),

  project_id: varchar('project_id', { length: 20 }),
  set_weight_kg: real('set_weight_kg'),

  image_in_process: boolean('image_in_process').notNull().default(false),

  vendor_pallet_height: real('vendor_pallet_height'),

  polybag_product_pallets_per_45hc: integer('polybag_product_pallets_per_45hc'),
  polybag_product_pallets_per_40std: integer(
    'polybag_product_pallets_per_40std'
  ),
  polybag_product_pallets_per_20std: integer(
    'polybag_product_pallets_per_20std'
  )
});

/* PRODUCT HISTORIC COSTS */
export const productHistoricCostsTable = pgTable(
  'product_historic_costs',
  {
    tech_sku_id: integer('tech_sku_id')
      .notNull()
      .references(() => productTable.tech_sku_id),

    start_date: timestamp('start_date', { withTimezone: false }).notNull(),
    end_date: timestamp('end_date', { withTimezone: false }).notNull(),

    cost: doublePrecision('cost').notNull(),
    cost_update_commentary: varchar('cost_update_commentary', {
      length: 200
    }).notNull(),
    import_incoterm: varchar('import_incoterm', { length: 10 }).notNull()
  },
  (table) => [
    primaryKey({
      columns: [
        table.tech_sku_id,
        table.start_date,
        table.end_date,
        table.import_incoterm
      ]
    })
  ]
);

/* PICTURES FOR TECH_SKU_ID */
export const productPicturesTable = pgTable(
  'product_pictures',
  {
    tech_sku_id: integer('tech_sku_id').notNull(),
    image_path: varchar('image_path', { length: 255 }).notNull(),
    image_order: integer('image_order').notNull()
  },
  (table) => ({
    pk: primaryKey({ columns: [table.tech_sku_id, table.image_order] }),
    techSkuIdx: index('product_pictures_tech_sku_id_idx').on(table.tech_sku_id)
  })
);

/* 
=====================================================================================================================
=====================================================================================================================
*/

/* HTS CODES */
export const htsCodesTable = pgTable('hts_codes', {
  hts_code: text('hts_code').primaryKey(),
  hts_category: text('hts_category'),
  min_value: real('min_value'),
  max_value: real('max_value'),
  type: text('type'),
  duty: real('duty'),
  cost_group: text('cost_group'),
  hts_product_subtype: text('hts_product_subtype'),
  fixed_duty_per_piece: real('fixed_duty_per_piece'),
  notes: text('notes')
});

/* INLAND PARAMETERS */
export const inlandParametersTable = pgTable(
  'inland_parameters',
  {
    id: serial('id').primaryKey(),

    // PK
    inland_type: text('inland_type').notNull(),
    port: text('port').notNull(),
    country: text('country').notNull(),

    zip_code: integer('zip_code'),
    value: real('value'),
    cost_group: text('cost_group'),
    user: text('user'),

    start_date: timestamp('start_date', { mode: 'string' }),
    end_date: timestamp('end_date', { mode: 'string' }).default(
      '2100-01-01T00:00:00Z'
    )
  },
  (table) => [
    unique('inland_pk').on(
      table.inland_type,
      table.port,
      table.country,
      table.start_date,
      table.end_date
    )
  ]
);

/* OCEAN FREIGHT TABLE */
export const oceanFreightTable = pgTable(
  'ocean_freights_parameters',
  {
    id: serial('id').primaryKey(),

    // PK
    origin_port: text('origin_port').notNull(),
    origin_country: text('origin_country').notNull(),
    destination_port: text('destination_port').notNull(),
    destination_country: text('destination_country').notNull(),
    container_type: text('container_type').notNull(),

    value: real('value'),
    cost_group: text('cost_group'),
    user: text('user'),

    start_date: timestamp('start_date', { mode: 'string' }),
    end_date: timestamp('end_date', { mode: 'string' }).default(
      '2100-01-01T00:00:00Z'
    )
  },
  (table) => [
    unique('ocean_freight_pk').on(
      table.origin_port,
      table.origin_country,
      table.destination_port,
      table.destination_country,
      table.container_type,
      table.start_date,
      table.end_date
    )
  ]
);

/* GROUND FREIGHT TABLE */
export const groundFreightTable = pgTable(
  'ground_freights_parameters',
  {
    id: serial('id').primaryKey(),

    // PK
    vendor: text('vendor').notNull(),
    factory_name: text('factory_name').notNull(),
    origin_country: text('origin_country').notNull(),
    destination_country: text('destination_country').notNull(),
    destination_warehouse: text('destination_warehouse').notNull(),
    container_type: text('container_type').notNull(),

    cost_detail: text('cost_detail'),
    value: real('value'),
    cost_group: text('cost_group'),
    user: text('user'),

    start_date: timestamp('start_date', { mode: 'string' }),
    end_date: timestamp('end_date', { mode: 'string' }).default(
      '2100-01-01T00:00:00Z'
    )
  },
  (table) => [
    unique('ground_freight_pk').on(
      table.vendor,
      table.factory_name,
      table.origin_country,
      table.destination_country,
      table.destination_warehouse,
      table.container_type,
      table.start_date,
      table.end_date
    )
  ]
);

/* TARIFF PARAMETERS TABLE */
export const tariffParametersTable = pgTable(
  'tariff_parameters',
  {
    id: serial('id').primaryKey(),

    // PK
    origin_country: text('origin_country').notNull(),
    destination_country: text('destination_country').notNull(),

    value: real('value'),
    cost_group: text('cost_group'),
    duty_dependent: boolean('duty_dependent'),
    user: text('user'),

    start_date: timestamp('start_date', { mode: 'string' }),
    end_date: timestamp('end_date', { mode: 'string' }).default(
      '2100-01-01T00:00:00Z'
    )
  },
  (table) => [
    unique('tariff_parameters_pk').on(
      table.origin_country,
      table.destination_country,
      table.start_date,
      table.end_date
    )
  ]
);

/* VENDOR PORTS */
export const vendorPortsTable = pgTable(
  'vendor_ports',
  {
    id: serial('id').primaryKey(),

    // PK
    vendor: text('vendor').notNull(),
    country: text('country').notNull(),
    port: text('port').notNull(),

    main_port: boolean('main_port'),
    user_id: text('user_id')
  },
  (table) => [
    unique('vendor_port_pk').on(table.vendor, table.country, table.port)
  ]
);

/* PORT COST TABLE */
export const portCostTable = pgTable(
  'port_cost_parameters',
  {
    id: serial('id').primaryKey(),

    // PK
    logistic_cost: text('logistic_cost').notNull(),

    value: real('value'),
    cost_group: text('cost_group'),
    user: text('user'),

    start_date: timestamp('start_date', { mode: 'string' }),
    end_date: timestamp('end_date', { mode: 'string' }).default(
      '2100-01-01T00:00:00Z'
    )
  },
  (table) => [
    unique('port_cost_pk').on(
      table.logistic_cost,
      table.start_date,
      table.end_date
    )
  ]
);

/* INCOTERM COST GROUP */
export const incotermCostGroupTable = pgTable(
  'incoterm_cost_group',
  {
    id: serial('id').primaryKey(),

    // PK
    cost_group: text('cost_group').notNull(),
    vendor: text('vendor').notNull(),
    country: text('country').notNull(),
    incoterm: text('incoterm').notNull()
  },
  (table) => [
    unique('incoterm_cost_group_pk').on(
      table.cost_group,
      table.vendor,
      table.country,
      table.incoterm
    )
  ]
);

/* TARIFF HTS EXCEPTIONS TABLE */
export const tariffHTSExceptionsTable = pgTable(
  'tariff_hts_exceptions',
  {
    id: serial('id').primaryKey(),

    // PK
    hts_code: text('hts_code').notNull(),
    origin_country: text('origin_country').notNull(),
    destination_country: text('destination_country').notNull(),

    special_tariff_value: real('special_tariff_value'),
    cost_group: text('cost_group'),
    user: text('user'),

    start_date: timestamp('start_date', { mode: 'string' }),
    end_date: timestamp('end_date', { mode: 'string' }).default(
      '2100-01-01T00:00:00Z'
    )
  },
  (table) => [
    unique('hts_exceptions_pk').on(
      table.hts_code,
      table.origin_country,
      table.destination_country,
      table.start_date,
      table.end_date
    )
  ]
);

/* DUTIES COMMERCIAL AGREEMENTS */
export const dutiesCommercialAgreementsTable = pgTable(
  'duties_commercial_agreements',
  {
    id: serial('id').primaryKey(),

    // PK
    origin_country: text('origin_country').notNull(),
    destination_country: text('destination_country').notNull(),
    raw_material: text('raw_material').notNull(),

    cost_group: text('cost_group'),
    user: text('user'),

    start_date: timestamp('start_date', { mode: 'string' }),
    end_date: timestamp('end_date', { mode: 'string' }).default(
      '2100-01-01T00:00:00Z'
    )
  },
  (table) => [
    unique('duties_commercial_agreements_pk').on(
      table.origin_country,
      table.destination_country,
      table.raw_material,
      table.start_date,
      table.end_date
    )
  ]
);

/* OTHER PARAMETERS */
export const otherParametersTable = pgTable('other_parameters', {
  parameter: text('parameter').primaryKey(),
  value: real('value').notNull(),
  cost_group: text('cost_group').notNull()
});

/* PRODUCT VIEW TABLE */
export type ProductTable = typeof productTable.$inferSelect;
export type NewProductTable = typeof productTable.$inferInsert;

export type ProductsViewTable = typeof productViewTable.$inferSelect;
export type NewProductsViewTable = typeof productViewTable.$inferInsert;

/* PARAMETERS */
export type HTSCode = typeof htsCodesTable.$inferSelect;
export type NewHTSCode = typeof htsCodesTable.$inferInsert;

export type InlandParameter = typeof inlandParametersTable.$inferSelect;
export type NewInlandParameter = typeof inlandParametersTable.$inferInsert;

export type TariffParameters = typeof tariffParametersTable.$inferSelect;
export type NewTariffParameters = typeof tariffParametersTable.$inferInsert;

export type OceanFreight = typeof oceanFreightTable.$inferSelect;
export type NewOceanFreight = typeof oceanFreightTable.$inferInsert;

export type GroundFreight = typeof groundFreightTable.$inferSelect;
export type NewGroundFreight = typeof groundFreightTable.$inferInsert;

export type VendorPort = typeof vendorPortsTable.$inferSelect;
export type NewVendorPort = typeof vendorPortsTable.$inferInsert;

export type PortCost = typeof portCostTable.$inferSelect;
export type NewPortCost = typeof portCostTable.$inferInsert;

export type IncotermCostGroup = typeof incotermCostGroupTable.$inferSelect;
export type NewIncotermCostGroup = typeof incotermCostGroupTable.$inferInsert;

export type TariffHTSExceptionsTable =
  typeof tariffHTSExceptionsTable.$inferSelect;
export type NewTariffHTSExceptionsTable =
  typeof tariffHTSExceptionsTable.$inferInsert;

export type DutiesCommercialAgreements =
  typeof dutiesCommercialAgreementsTable.$inferSelect;
export type NewDutiesCommercialAgreements =
  typeof dutiesCommercialAgreementsTable.$inferInsert;

export type OtherParameter = typeof otherParametersTable.$inferSelect;
export type NewOtherParameter = typeof otherParametersTable.$inferInsert;

/* PRODUCTS - FRAN */
export const productsTable = pgTable(
  'products_table',
  {
    id: serial('id').primaryKey(),
    user_id: text('user_id').notNull(),
    photo_url: text('photo_url').notNull(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    price: real('price').notNull(),
    category: text('category').notNull(),
    updated_at: timestamp('updated_at').notNull().defaultNow()
  },
  (table) => [unique('name_user_idx').on(table.name, table.user_id)]
);
export type Product = typeof productsTable.$inferSelect;
export type NewProduct = typeof productsTable.$inferInsert;
