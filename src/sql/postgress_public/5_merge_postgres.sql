MERGE INTO public.product_view_table AS T
USING (
    SELECT *
    FROM public.product_view_table_tmp
) AS S
ON T.tech_sku_id = S.tech_sku_id

WHEN MATCHED AND (
       T.cn_code IS DISTINCT FROM S.cn_code
    OR T."status" IS DISTINCT FROM S."status"
    OR T.image_in_process IS DISTINCT FROM S.image_in_process
    OR T.factory_code IS DISTINCT FROM S.factory_code
    OR T.factory_mold IS DISTINCT FROM S.factory_mold
    OR T.item_upc IS DISTINCT FROM S.item_upc
    OR T.case_upc IS DISTINCT FROM S.case_upc
    OR T.vendor IS DISTINCT FROM S.vendor
    OR T.brand_name IS DISTINCT FROM S.brand_name
    OR T.origin_country IS DISTINCT FROM S.origin_country
    OR T.pre_price IS DISTINCT FROM S.pre_price
    OR T.factory_name IS DISTINCT FROM S.factory_name
    OR T."description" IS DISTINCT FROM S."description"
    OR T.short_description IS DISTINCT FROM S.short_description
    OR T.super_category IS DISTINCT FROM S.super_category
    OR T.category IS DISTINCT FROM S.category
    OR T.sub_category IS DISTINCT FROM S.sub_category
    OR T.consumer_use IS DISTINCT FROM S.consumer_use
    OR T.set_collection IS DISTINCT FROM S.set_collection
    OR T.product_collection IS DISTINCT FROM S.product_collection
    OR T.process_type IS DISTINCT FROM S.process_type
    OR T.season IS DISTINCT FROM S.season
    OR T.color_family IS DISTINCT FROM S.color_family
    OR T.color_description IS DISTINCT FROM S.color_description
    OR T.pantone_code IS DISTINCT FROM S.pantone_code
    OR T.tosaf_code IS DISTINCT FROM S.tosaf_code
    OR T.raw_material IS DISTINCT FROM S.raw_material
    OR T.finishing IS DISTINCT FROM S.finishing
    OR T.shipping_pack IS DISTINCT FROM S.shipping_pack
    OR T.label IS DISTINCT FROM S.label
    OR T.packing IS DISTINCT FROM S.packing
    OR T.pieces_per_unit IS DISTINCT FROM S.pieces_per_unit
    OR T.case_pack IS DISTINCT FROM S.case_pack
    OR T.pieces_per_carton IS DISTINCT FROM S.pieces_per_carton
    OR T.carton_per_american_pallet IS DISTINCT FROM S.carton_per_american_pallet
    OR T.estimated_carton_per_american_pallet IS DISTINCT FROM S.estimated_carton_per_american_pallet
    OR T.ti IS DISTINCT FROM S.ti
    OR T.hi IS DISTINCT FROM S.hi
    OR T.product_or_kit IS DISTINCT FROM S.product_or_kit
    OR T."notes" IS DISTINCT FROM S."notes"
    OR T.product_length_mm IS DISTINCT FROM S.product_length_mm
    OR T.product_height_mm IS DISTINCT FROM S.product_height_mm
    OR T.product_width_mm IS DISTINCT FROM S.product_width_mm
    OR T.product_weight_kg IS DISTINCT FROM S.product_weight_kg
    OR T.product_volume_ml IS DISTINCT FROM S.product_volume_ml
    OR T.product_length_in IS DISTINCT FROM S.product_length_in
    OR T.product_height_in IS DISTINCT FROM S.product_height_in
    OR T.product_width_in IS DISTINCT FROM S.product_width_in
    OR T.product_weight_lb IS DISTINCT FROM S.product_weight_lb
    OR T.product_volume_oz IS DISTINCT FROM S.product_volume_oz
    OR T.set_length_mm IS DISTINCT FROM S.set_length_mm
    OR T.set_height_mm IS DISTINCT FROM S.set_height_mm
    OR T.set_width_mm IS DISTINCT FROM S.set_width_mm
    OR T.set_weight_kg IS DISTINCT FROM S.set_weight_kg
    OR T.set_weight_lb IS DISTINCT FROM S.set_weight_lb
    OR T.set_length_in IS DISTINCT FROM S.set_length_in
    OR T.set_height_in IS DISTINCT FROM S.set_height_in
    OR T.set_width_in IS DISTINCT FROM S.set_width_in
    OR T.carton_length_mm IS DISTINCT FROM S.carton_length_mm
    OR T.carton_height_mm IS DISTINCT FROM S.carton_height_mm
    OR T.carton_width_mm IS DISTINCT FROM S.carton_width_mm
    OR T.carton_weight_kg IS DISTINCT FROM S.carton_weight_kg
    OR T.carton_length_in IS DISTINCT FROM S.carton_length_in
    OR T.carton_height_in IS DISTINCT FROM S.carton_height_in
    OR T.carton_width_in IS DISTINCT FROM S.carton_width_in
    OR T.carton_weight_lb IS DISTINCT FROM S.carton_weight_lb
    OR T.pieces_per_polybag IS DISTINCT FROM S.pieces_per_polybag
    OR T.polybag_per_pallet IS DISTINCT FROM S.polybag_per_pallet
    OR T.polybag_pallet_type IS DISTINCT FROM S.polybag_pallet_type
    OR T.polybag_product_pallets_per_40hc IS DISTINCT FROM S.polybag_product_pallets_per_40hc
    OR T.polybag_product_pallets_per_45hc IS DISTINCT FROM S.polybag_product_pallets_per_45hc
    OR T.polybag_product_pallets_per_40std IS DISTINCT FROM S.polybag_product_pallets_per_40std
    OR T.polybag_product_pallets_per_20std IS DISTINCT FROM S.polybag_product_pallets_per_20std
    OR T.polybag_product_pallets_per_53ft IS DISTINCT FROM S.polybag_product_pallets_per_53ft
    OR T.polybag_length_mm IS DISTINCT FROM S.polybag_length_mm
    OR T.polybag_width_mm IS DISTINCT FROM S.polybag_width_mm
    OR T.polybag_height_mm IS DISTINCT FROM S.polybag_height_mm
    OR T.polybag_length_in IS DISTINCT FROM S.polybag_length_in
    OR T.polybag_width_in IS DISTINCT FROM S.polybag_width_in
    OR T.polybag_height_in IS DISTINCT FROM S.polybag_height_in
    OR T.polybag_to_carton_length_mm IS DISTINCT FROM S.polybag_to_carton_length_mm
    OR T.polybag_to_carton_width_mm IS DISTINCT FROM S.polybag_to_carton_width_mm
    OR T.polybag_to_carton_height_mm IS DISTINCT FROM S.polybag_to_carton_height_mm
    OR T.polybag_to_carton_length_in IS DISTINCT FROM S.polybag_to_carton_length_in
    OR T.polybag_to_carton_width_in IS DISTINCT FROM S.polybag_to_carton_width_in
    OR T.polybag_to_carton_height_in IS DISTINCT FROM S.polybag_to_carton_height_in
    OR T.case_cbm IS DISTINCT FROM S.case_cbm
    OR T.cbm_const IS DISTINCT FROM S.cbm_const
    OR T.case_cft IS DISTINCT FROM S.case_cft
    OR T.loading_type IS DISTINCT FROM S.loading_type
    OR T.stacked_pallets IS DISTINCT FROM S.stacked_pallets
    OR T.receiving_carton_per_pallet IS DISTINCT FROM S.receiving_carton_per_pallet
    OR T.hts_code IS DISTINCT FROM S.hts_code
    OR T.hts_duty IS DISTINCT FROM S.hts_duty
    OR T.hts_type IS DISTINCT FROM S.hts_type
    OR T.hts_product_subtype IS DISTINCT FROM S.hts_product_subtype
    OR T.fob_current_cost_value IS DISTINCT FROM S.fob_current_cost_value
    OR T.fob_current_cost_start_date IS DISTINCT FROM S.fob_current_cost_start_date
    OR T.fob_current_cost_update_commentary IS DISTINCT FROM S.fob_current_cost_update_commentary
    OR T.exw_current_cost_value IS DISTINCT FROM S.exw_current_cost_value
    OR T.exw_current_cost_start_date IS DISTINCT FROM S.exw_current_cost_start_date
    OR T.exw_current_cost_update_commentary IS DISTINCT FROM S.exw_current_cost_update_commentary
    OR T.ddp_current_cost_value IS DISTINCT FROM S.ddp_current_cost_value
    OR T.ddp_current_cost_start_date IS DISTINCT FROM S.ddp_current_cost_start_date
    OR T.ddp_current_cost_update_commentary IS DISTINCT FROM S.ddp_current_cost_update_commentary
    OR T.cnf_diff_current_cost_value IS DISTINCT FROM S.cnf_diff_current_cost_value
    OR T.cnf_diff_current_cost_start_date IS DISTINCT FROM S.cnf_diff_current_cost_start_date
    OR T.cnf_diff_current_cost_update_commentary IS DISTINCT FROM S.cnf_diff_current_cost_update_commentary
    OR T.cnf_current_cost_value IS DISTINCT FROM S.cnf_current_cost_value
    OR T.cnf_current_cost_start_date IS DISTINCT FROM S.cnf_current_cost_start_date
    OR T.cnf_current_cost_update_commentary IS DISTINCT FROM S.cnf_current_cost_update_commentary
    OR T.mrsp IS DISTINCT FROM S.mrsp
    OR T.commission_percentage IS DISTINCT FROM S.commission_percentage
    OR T.commission_amount IS DISTINCT FROM S.commission_amount
    OR T.duty_percentage IS DISTINCT FROM S.duty_percentage
    OR T.fixed_duty_per_piece IS DISTINCT FROM S.fixed_duty_per_piece
    OR T.duty_cost IS DISTINCT FROM S.duty_cost
    OR T.tariff IS DISTINCT FROM S.tariff
    OR T.max_carton_per_weight IS DISTINCT FROM S.max_carton_per_weight
    OR T.max_case_pack_per_weight IS DISTINCT FROM S.max_case_pack_per_weight
    OR T.confirmed_carton_per_40hc IS DISTINCT FROM S.confirmed_carton_per_40hc
    OR T.calculated_cartons_40hc_per_volume IS DISTINCT FROM S.calculated_cartons_40hc_per_volume
    OR T.calculated_case_pack_40hc_per_volume IS DISTINCT FROM S.calculated_case_pack_40hc_per_volume
    OR T.optimal_cartons_per_40hc IS DISTINCT FROM S.optimal_cartons_per_40hc
    OR T.optimal_pieces_per_40hc IS DISTINCT FROM S.optimal_pieces_per_40hc
    OR T.confirmed_carton_per_45hc IS DISTINCT FROM S.confirmed_carton_per_45hc
    OR T.calculated_cartons_45hc_per_volume IS DISTINCT FROM S.calculated_cartons_45hc_per_volume
    OR T.calculated_case_pack_45hc_per_volume IS DISTINCT FROM S.calculated_case_pack_45hc_per_volume
    OR T.optimal_cartons_per_45hc IS DISTINCT FROM S.optimal_cartons_per_45hc
    OR T.optimal_pieces_per_45hc IS DISTINCT FROM S.optimal_pieces_per_45hc
    OR T.confirmed_carton_per_40std IS DISTINCT FROM S.confirmed_carton_per_40std
    OR T.calculated_cartons_40std_per_volume IS DISTINCT FROM S.calculated_cartons_40std_per_volume
    OR T.calculated_case_pack_40std_per_volume IS DISTINCT FROM S.calculated_case_pack_40std_per_volume
    OR T.optimal_cartons_per_40std IS DISTINCT FROM S.optimal_cartons_per_40std
    OR T.optimal_pieces_per_40std IS DISTINCT FROM S.optimal_pieces_per_40std
    OR T.confirmed_carton_per_20std IS DISTINCT FROM S.confirmed_carton_per_20std
    OR T.calculated_cartons_20std_per_volume IS DISTINCT FROM S.calculated_cartons_20std_per_volume
    OR T.calculated_case_pack_20std_per_volume IS DISTINCT FROM S.calculated_case_pack_20std_per_volume
    OR T.optimal_cartons_per_20std IS DISTINCT FROM S.optimal_cartons_per_20std
    OR T.optimal_pieces_per_20std IS DISTINCT FROM S.optimal_pieces_per_20std
    OR T.confirmed_carton_per_53ft IS DISTINCT FROM S.confirmed_carton_per_53ft
    OR T.calculated_cartons_53ft_per_volume IS DISTINCT FROM S.calculated_cartons_53ft_per_volume
    OR T.calculated_case_pack_53ft_per_volume IS DISTINCT FROM S.calculated_case_pack_53ft_per_volume
    OR T.optimal_cartons_per_53ft IS DISTINCT FROM S.optimal_cartons_per_53ft
    OR T.optimal_pieces_per_53ft IS DISTINCT FROM S.optimal_pieces_per_53ft
    OR T.logistic_cost_40hc IS DISTINCT FROM S.logistic_cost_40hc
    OR T.logistic_cost_45hc IS DISTINCT FROM S.logistic_cost_45hc
    OR T.logistic_cost_40std IS DISTINCT FROM S.logistic_cost_40std
    OR T.logistic_cost_20std IS DISTINCT FROM S.logistic_cost_20std
    OR T.logistic_cost_53ft IS DISTINCT FROM S.logistic_cost_53ft
    OR T.landed_cost_40hc IS DISTINCT FROM S.landed_cost_40hc
    OR T.landed_cost_45hc IS DISTINCT FROM S.landed_cost_45hc
    OR T.landed_cost_40std IS DISTINCT FROM S.landed_cost_40std
    OR T.landed_cost_20std IS DISTINCT FROM S.landed_cost_20std
    OR T.landed_cost_53ft IS DISTINCT FROM S.landed_cost_53ft
    OR T.image_path IS DISTINCT FROM S.image_path
    OR T.average_cost IS DISTINCT FROM S.average_cost
    OR T.inventory_today IS DISTINCT FROM S.inventory_today
    OR T.inventory_today_7 IS DISTINCT FROM S.inventory_today_7
    OR T.inventory_today_14 IS DISTINCT FROM S.inventory_today_14
    OR T.inventory_today_21 IS DISTINCT FROM S.inventory_today_21
    OR T.inventory_today_49 IS DISTINCT FROM S.inventory_today_49
    OR T.inventory_today_77 IS DISTINCT FROM S.inventory_today_77
    OR T.inventory_today_105 IS DISTINCT FROM S.inventory_today_105
)

THEN UPDATE SET
    cn_code = S.cn_code,
    "status" = S."status",
    image_in_process = S.image_in_process,
    factory_code = S.factory_code,
    factory_mold = S.factory_mold,
    item_upc = S.item_upc,
    case_upc = S.case_upc,
    vendor = S.vendor,
    brand_name = S.brand_name,
    origin_country = S.origin_country,
    pre_price = S.pre_price,
    factory_name = S.factory_name,
    "description" = S."description",
    short_description = S.short_description,
    super_category = S.super_category,
    category = S.category,
    sub_category = S.sub_category,
    consumer_use = S.consumer_use,
    set_collection = S.set_collection,
    product_collection = S.product_collection,
    process_type = S.process_type,
    season = S.season,
    color_family = S.color_family,
    color_description = S.color_description,
    pantone_code = S.pantone_code,
    tosaf_code = S.tosaf_code,
    raw_material = S.raw_material,
    finishing = S.finishing,
    shipping_pack = S.shipping_pack,
    label = S.label,
    packing = S.packing,
    pieces_per_unit = S.pieces_per_unit,
    case_pack = S.case_pack,
    pieces_per_carton = S.pieces_per_carton,
    carton_per_american_pallet = S.carton_per_american_pallet,
    estimated_carton_per_american_pallet = S.estimated_carton_per_american_pallet,
    ti = S.ti,
    hi = S.hi,
    product_or_kit = S.product_or_kit,
    "notes" = S."notes",
    product_length_mm = S.product_length_mm,
    product_height_mm = S.product_height_mm,
    product_width_mm = S.product_width_mm,
    product_weight_kg = S.product_weight_kg,
    product_volume_ml = S.product_volume_ml,
    product_length_in = S.product_length_in,
    product_height_in = S.product_height_in,
    product_width_in = S.product_width_in,
    product_weight_lb = S.product_weight_lb,
    product_volume_oz = S.product_volume_oz,
    set_length_mm = S.set_length_mm,
    set_height_mm = S.set_height_mm,
    set_width_mm = S.set_width_mm,
    set_weight_kg = S.set_weight_kg,
    set_weight_lb = S.set_weight_lb,
    set_length_in = S.set_length_in,
    set_height_in = S.set_height_in,
    set_width_in = S.set_width_in,
    carton_length_mm = S.carton_length_mm,
    carton_height_mm = S.carton_height_mm,
    carton_width_mm = S.carton_width_mm,
    carton_weight_kg = S.carton_weight_kg,
    carton_length_in = S.carton_length_in,
    carton_height_in = S.carton_height_in,
    carton_width_in = S.carton_width_in,
    carton_weight_lb = S.carton_weight_lb,
    pieces_per_polybag = S.pieces_per_polybag,
    polybag_per_pallet = S.polybag_per_pallet,
    polybag_pallet_type = S.polybag_pallet_type,
    polybag_product_pallets_per_40hc = S.polybag_product_pallets_per_40hc,
    polybag_product_pallets_per_45hc = S.polybag_product_pallets_per_45hc,
    polybag_product_pallets_per_40std = S.polybag_product_pallets_per_40std,
    polybag_product_pallets_per_20std = S.polybag_product_pallets_per_20std,
    polybag_product_pallets_per_53ft = S.polybag_product_pallets_per_53ft,
    polybag_length_mm = S.polybag_length_mm,
    polybag_width_mm = S.polybag_width_mm,
    polybag_height_mm = S.polybag_height_mm,
    polybag_length_in = S.polybag_length_in,
    polybag_width_in = S.polybag_width_in,
    polybag_height_in = S.polybag_height_in,
    polybag_to_carton_length_mm = S.polybag_to_carton_length_mm,
    polybag_to_carton_width_mm = S.polybag_to_carton_width_mm,
    polybag_to_carton_height_mm = S.polybag_to_carton_height_mm,
    polybag_to_carton_length_in = S.polybag_to_carton_length_in,
    polybag_to_carton_width_in = S.polybag_to_carton_width_in,
    polybag_to_carton_height_in = S.polybag_to_carton_height_in,
    case_cbm = S.case_cbm,
    cbm_const = S.cbm_const,
    case_cft = S.case_cft,
    loading_type = S.loading_type,
    stacked_pallets = S.stacked_pallets,
    receiving_carton_per_pallet = S.receiving_carton_per_pallet,
    hts_code = S.hts_code,
    hts_duty = S.hts_duty,
    hts_type = S.hts_type,
    hts_product_subtype = S.hts_product_subtype,
    fob_current_cost_value = S.fob_current_cost_value,
    fob_current_cost_start_date = S.fob_current_cost_start_date,
    fob_current_cost_update_commentary = S.fob_current_cost_update_commentary,
    exw_current_cost_value = S.exw_current_cost_value,
    exw_current_cost_start_date = S.exw_current_cost_start_date,
    exw_current_cost_update_commentary = S.exw_current_cost_update_commentary,
    ddp_current_cost_value = S.ddp_current_cost_value,
    ddp_current_cost_start_date = S.ddp_current_cost_start_date,
    ddp_current_cost_update_commentary = S.ddp_current_cost_update_commentary,
    cnf_diff_current_cost_value = S.cnf_diff_current_cost_value,
    cnf_diff_current_cost_start_date = S.cnf_diff_current_cost_start_date,
    cnf_diff_current_cost_update_commentary = S.cnf_diff_current_cost_update_commentary,
    cnf_current_cost_value = S.cnf_current_cost_value,
    cnf_current_cost_start_date = S.cnf_current_cost_start_date,
    cnf_current_cost_update_commentary = S.cnf_current_cost_update_commentary,
    mrsp = S.mrsp,
    commission_percentage = S.commission_percentage,
    commission_amount = S.commission_amount,
    duty_percentage = S.duty_percentage,
    fixed_duty_per_piece = S.fixed_duty_per_piece,
    duty_cost = S.duty_cost,
    tariff = S.tariff,
    max_carton_per_weight = S.max_carton_per_weight,
    max_case_pack_per_weight = S.max_case_pack_per_weight,
    confirmed_carton_per_40hc = S.confirmed_carton_per_40hc,
    calculated_cartons_40hc_per_volume = S.calculated_cartons_40hc_per_volume,
    calculated_case_pack_40hc_per_volume = S.calculated_case_pack_40hc_per_volume,
    optimal_cartons_per_40hc = S.optimal_cartons_per_40hc,
    optimal_pieces_per_40hc = S.optimal_pieces_per_40hc,
    confirmed_carton_per_45hc = S.confirmed_carton_per_45hc,
    calculated_cartons_45hc_per_volume = S.calculated_cartons_45hc_per_volume,
    calculated_case_pack_45hc_per_volume = S.calculated_case_pack_45hc_per_volume,
    optimal_cartons_per_45hc = S.optimal_cartons_per_45hc,
    optimal_pieces_per_45hc = S.optimal_pieces_per_45hc,
    confirmed_carton_per_40std = S.confirmed_carton_per_40std,
    calculated_cartons_40std_per_volume = S.calculated_cartons_40std_per_volume,
    calculated_case_pack_40std_per_volume = S.calculated_case_pack_40std_per_volume,
    optimal_cartons_per_40std = S.optimal_cartons_per_40std,
    optimal_pieces_per_40std = S.optimal_pieces_per_40std,
    confirmed_carton_per_20std = S.confirmed_carton_per_20std,
    calculated_cartons_20std_per_volume = S.calculated_cartons_20std_per_volume,
    calculated_case_pack_20std_per_volume = S.calculated_case_pack_20std_per_volume,
    optimal_cartons_per_20std = S.optimal_cartons_per_20std,
    optimal_pieces_per_20std = S.optimal_pieces_per_20std,
    confirmed_carton_per_53ft = S.confirmed_carton_per_53ft,
    calculated_cartons_53ft_per_volume = S.calculated_cartons_53ft_per_volume,
    calculated_case_pack_53ft_per_volume = S.calculated_case_pack_53ft_per_volume,
    optimal_cartons_per_53ft = S.optimal_cartons_per_53ft,
    optimal_pieces_per_53ft = S.optimal_pieces_per_53ft,
    logistic_cost_40hc = S.logistic_cost_40hc,
    logistic_cost_45hc = S.logistic_cost_45hc,
    logistic_cost_40std = S.logistic_cost_40std,
    logistic_cost_20std = S.logistic_cost_20std,
    logistic_cost_53ft = S.logistic_cost_53ft,
    landed_cost_40hc = S.landed_cost_40hc,
    landed_cost_45hc = S.landed_cost_45hc,
    landed_cost_40std = S.landed_cost_40std,
    landed_cost_20std = S.landed_cost_20std,
    landed_cost_53ft = S.landed_cost_53ft,
    image_path = S.image_path,
    average_cost = S.average_cost,
    inventory_today = S.inventory_today,
    inventory_today_7 = S.inventory_today_7,
    inventory_today_14 = S.inventory_today_14,
    inventory_today_21 = S.inventory_today_21,
    inventory_today_49 = S.inventory_today_49,
    inventory_today_77 = S.inventory_today_77,
    inventory_today_105 = S.inventory_today_105

WHEN NOT MATCHED THEN
INSERT VALUES (S.*)

WHEN NOT MATCHED BY SOURCE THEN DELETE;
