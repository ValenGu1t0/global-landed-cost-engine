TRUNCATE public.product_view_table_tmp;

-- Insertar PRODUCT VIEW
INSERT INTO public.product_view_table_tmp
SELECT
    p.tech_sku_id, p.cn_code, p.status, p.image_in_process, p.factory_code, p.factory_mold, p.item_upc, p.case_upc, 
    p.vendor, p.brand_name, p.origin_country, p.pre_price, p.factory_name, p.description, p.short_description, 
    p.super_category, p.category, p.sub_category, p.consumer_use, p.set_collection, p.product_collection, 
    p.process_type, p.season, p.color_family, p.color_description, p.pantone_code, p.tosaf_code, 
    p.raw_material, p.finishing, p.shipping_pack, p.label, p.packing, p.pieces_per_unit, p.case_pack, 
    p.pieces_per_carton, p.carton_per_american_pallet, p.estimated_carton_per_american_pallet, p.ti, p.hi, 
    p.product_or_kit, p.notes,
    p.product_length_mm, p.product_height_mm, p.product_width_mm, p.product_weight_kg, p.product_volume_ml, 
    p.product_length_in, p.product_height_in, p.product_width_in, p.product_weight_lb, p.product_volume_oz,
    p.set_length_mm, p.set_height_mm, p.set_width_mm, p.set_weight_kg, p.set_weight_lb, p.set_length_in, p.set_height_in, p.set_width_in, 
    p.carton_length_mm, p.carton_height_mm, p.carton_width_mm, p.carton_weight_kg, p.carton_length_in, p.carton_height_in, 
    p.carton_width_in, p.carton_weight_lb, p.pieces_per_polybag, p.polybag_per_pallet, p.polybag_pallet_type, 
    p.polybag_product_pallets_per_40hc, p.polybag_product_pallets_per_45hc, p.polybag_product_pallets_per_40std,
    p.polybag_product_pallets_per_20std, p.polybag_product_pallets_per_53ft,
    p.polybag_length_mm, p.polybag_width_mm, p.polybag_height_mm, p.polybag_length_in, p.polybag_width_in, 
    p.polybag_height_in, p.polybag_to_carton_length_mm, p.polybag_to_carton_width_mm, p.polybag_to_carton_height_mm, 
    p.polybag_to_carton_length_in, p.polybag_to_carton_width_in, p.polybag_to_carton_height_in, 
    p.case_cbm, p.cbm_const, p.case_cft, p.loading_type, p.stacked_pallets, p.receiving_carton_per_pallet, 
    p.hts_code, p.hts_duty, p.hts_type, p.hts_product_subtype, 
    p.fob_current_cost_value, p.fob_current_cost_start_date, p.fob_current_cost_update_commentary, 
    p.exw_current_cost_value, p.exw_current_cost_start_date, p.exw_current_cost_update_commentary,
    p.ddp_current_cost_value, p.ddp_current_cost_start_date, p.ddp_current_cost_update_commentary, 
    p.cnf_diff_current_cost_value, p.cnf_diff_current_cost_start_date, p.cnf_diff_current_cost_update_commentary, 
    p.cnf_current_cost_value, p.cnf_current_cost_start_date, p.cnf_current_cost_update_commentary,
    p.mrsp, p.commission_percentage, p.commission_amount, p.duty_percentage, p.fixed_duty_per_piece, 
    p.duty_cost, p.tariff, 
    p.max_carton_per_weight, p.max_case_pack_per_weight, 
    p.confirmed_carton_per_40hc, p.calculated_cartons_40hc_per_volume, p.calculated_case_pack_40hc_per_volume,
    p.optimal_cartons_per_40hc, p.optimal_pieces_per_40hc, 
    p.confirmed_carton_per_45hc, p.calculated_cartons_45hc_per_volume, p.calculated_case_pack_45hc_per_volume,
    p.optimal_cartons_per_45hc, p.optimal_pieces_per_45hc, 
    p.confirmed_carton_per_40std, p.calculated_cartons_40std_per_volume, p.calculated_case_pack_40std_per_volume,
    p.optimal_cartons_per_40std, p.optimal_pieces_per_40std, 
    p.confirmed_carton_per_20std, p.calculated_cartons_20std_per_volume, p.calculated_case_pack_20std_per_volume,
    p.optimal_cartons_per_20std, p.optimal_pieces_per_20std, 
    p.confirmed_carton_per_53ft, p.calculated_cartons_53ft_per_volume, p.calculated_case_pack_53ft_per_volume,
    p.optimal_cartons_per_53ft, p.optimal_pieces_per_53ft, 
    p.logistic_cost_40hc, p.logistic_cost_45hc, p.logistic_cost_40std, p.logistic_cost_20std, p.logistic_cost_53ft, 
    p.landed_cost_40hc, p.landed_cost_45hc, p.landed_cost_40std, p.landed_cost_20std, p.landed_cost_53ft,
    pp.image_path,
    ac.average_cost,
    ia.today AS inventory_today,
    ia.today_7 AS inventory_today_7,
    ia.today_14 AS inventory_today_14,
    ia.today_21 AS inventory_today_21,
    ia.today_49 AS inventory_today_49,
    ia.today_77 AS inventory_today_77,
    ia.today_105 AS inventory_today_105
FROM int.product_view p
LEFT JOIN public.ia_inventory_availability ia 
    ON p.cn_code = ia.cn_code
LEFT JOIN public.ia_product_average_cost ac 
    ON p.cn_code = ac.cn_code
LEFT JOIN (
    SELECT tech_sku_id, image_path
    FROM public.product_pictures
    WHERE image_order = 1
) pp ON p.tech_sku_id = pp.tech_sku_id;



-- Insertar KIT VIEW (UNION ALL)
INSERT INTO public.product_view_table_tmp
SELECT
    k.tech_sku_id, k.cn_code, k.status, k.image_in_process, k.factory_code, k.factory_mold, k.item_upc, k.case_upc, 
    k.vendor, k.brand_name, k.origin_country, k.pre_price, k.factory_name, k.description, k.short_description, 
    k.super_category, k.category, k.sub_category, k.consumer_use, k.set_collection, k.product_collection, 
    k.process_type, k.season, k.color_family, k.color_description, k.pantone_code, k.tosaf_code, 
    k.raw_material, k.finishing, k.shipping_pack, k.label, k.packing, k.pieces_per_unit, k.case_pack, 
    k.pieces_per_carton, k.carton_per_american_pallet, k.estimated_carton_per_american_pallet, k.ti, k.hi, 
    k.product_or_kit, k.notes,
    k.product_length_mm, k.product_height_mm, k.product_width_mm, k.product_weight_kg, k.product_volume_ml, 
    k.product_length_in, k.product_height_in, k.product_width_in, k.product_weight_lb, k.product_volume_oz,
    k.set_length_mm, k.set_height_mm, k.set_width_mm, k.set_weight_kg, k.set_weight_lb, k.set_length_in, k.set_height_in, k.set_width_in, 
    k.carton_length_mm, k.carton_height_mm, k.carton_width_mm, k.carton_weight_kg, k.carton_length_in, k.carton_height_in, 
    k.carton_width_in, k.carton_weight_lb, k.pieces_per_polybag, k.polybag_per_pallet, k.polybag_pallet_type, 
    k.polybag_product_pallets_per_40hc, k.polybag_product_pallets_per_45hc, 
    k.polybag_product_pallets_per_40std, k.polybag_product_pallets_per_20std, k.polybag_product_pallets_per_53ft,
    k.polybag_length_mm, k.polybag_width_mm, k.polybag_height_mm, 
    k.polybag_length_in, k.polybag_width_in, k.polybag_height_in,
    k.polybag_to_carton_length_mm, k.polybag_to_carton_width_mm, k.polybag_to_carton_height_mm, 
    k.polybag_to_carton_length_in, k.polybag_to_carton_width_in, k.polybag_to_carton_height_in, 
    k.case_cbm, k.cbm_const, k.case_cft, k.loading_type, k.stacked_pallets, k.receiving_carton_per_pallet, 
    k.hts_code, k.hts_duty, k.hts_type, k.hts_product_subtype, 
    k.fob_current_cost_value, k.fob_current_cost_start_date, k.fob_current_cost_update_commentary, 
    k.exw_current_cost_value, k.exw_current_cost_start_date, k.exw_current_cost_update_commentary,
    k.ddp_current_cost_value, k.ddp_current_cost_start_date, k.ddp_current_cost_update_commentary, 
    k.cnf_diff_current_cost_value, k.cnf_diff_current_cost_start_date, k.cnf_diff_current_cost_update_commentary, 
    k.cnf_current_cost_value, k.cnf_current_cost_start_date, k.cnf_current_cost_update_commentary,
    k.mrsp, k.commission_percentage, k.commission_amount, k.duty_percentage, k.fixed_duty_per_piece, 
    k.duty_cost, k.tariff, 
    k.max_carton_per_weight, k.max_case_pack_per_weight, 
    k.confirmed_carton_per_40hc, k.calculated_cartons_40hc_per_volume, k.calculated_case_pack_40hc_per_volume,
    k.optimal_cartons_per_40hc, k.optimal_pieces_per_40hc, 
    k.confirmed_carton_per_45hc, k.calculated_cartons_45hc_per_volume, k.calculated_case_pack_45hc_per_volume,
    k.optimal_cartons_per_45hc, k.optimal_pieces_per_45hc, 
    k.confirmed_carton_per_40std, k.calculated_cartons_40std_per_volume, k.calculated_case_pack_40std_per_volume,
    k.optimal_cartons_per_40std, k.optimal_pieces_per_40std, 
    k.confirmed_carton_per_20std, k.calculated_cartons_20std_per_volume, k.calculated_case_pack_20std_per_volume,
    k.optimal_cartons_per_20std, k.optimal_pieces_per_20std, 
    k.confirmed_carton_per_53ft, k.calculated_cartons_53ft_per_volume, k.calculated_case_pack_53ft_per_volume,
    k.optimal_cartons_per_53ft, k.optimal_pieces_per_53ft, 
    k.logistic_cost_40hc, k.logistic_cost_45hc, k.logistic_cost_40std, k.logistic_cost_20std, k.logistic_cost_53ft, 
    k.landed_cost_40hc, k.landed_cost_45hc, k.landed_cost_40std, k.landed_cost_20std, k.landed_cost_53ft,
    pp.image_path,
    ac.average_cost,
    ia.today AS inventory_today,
    ia.today_7 AS inventory_today_7,
    ia.today_14 AS inventory_today_14,
    ia.today_21 AS inventory_today_21,
    ia.today_49 AS inventory_today_49,
    ia.today_77 AS inventory_today_77,
    ia.today_105 AS inventory_today_105
FROM int.kit_view k
LEFT JOIN public.ia_inventory_availability ia 
    ON k.cn_code = ia.cn_code
LEFT JOIN public.ia_product_average_cost ac 
    ON k.cn_code = ac.cn_code
LEFT JOIN (
    SELECT tech_sku_id, image_path
    FROM public.product_pictures
    WHERE image_order = 1
) pp ON k.tech_sku_id = pp.tech_sku_id;
