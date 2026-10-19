TRUNCATE int.kit_view;

INSERT INTO int.kit_view (
    tech_sku_id, cn_code, status, image_in_process, factory_code, factory_mold, project_id, item_upc, case_upc, vendor,
    brand_name, origin_country, pre_price, factory_name, description, short_description, super_category, category, sub_category,
    consumer_use, set_collection, product_collection, process_type, season, color_family, color_description, pantone_code, 
    tosaf_code, raw_material, finishing, shipping_pack, label, packing, pieces_per_unit, case_pack, pieces_per_carton,
    carton_per_american_pallet, estimated_carton_per_american_pallet, ti, hi, product_or_kit, notes,

    product_length_mm, product_height_mm, product_width_mm, product_weight_kg, product_volume_ml,
    product_length_in, product_height_in, product_width_in, product_weight_lb, product_volume_oz,

    set_length_mm, set_height_mm, set_width_mm, set_weight_kg,
    set_weight_lb, set_length_in, set_height_in, set_width_in,

    carton_length_mm, carton_height_mm, carton_width_mm,
    carton_weight_kg, carton_length_in, carton_height_in, carton_width_in, carton_weight_lb,

    pieces_per_polybag, polybag_per_pallet, polybag_pallet_type,
    polybag_product_pallets_per_40hc, polybag_product_pallets_per_45hc, 
    polybag_product_pallets_per_40std, polybag_product_pallets_per_20std, polybag_product_pallets_per_53ft,

    polybag_length_mm, polybag_width_mm, polybag_height_mm,
    polybag_length_in, polybag_width_in, polybag_height_in,

    polybag_to_carton_length_mm, polybag_to_carton_width_mm, polybag_to_carton_height_mm,
    polybag_to_carton_length_in, polybag_to_carton_width_in, polybag_to_carton_height_in,

    case_cbm, cbm_const, case_cft, loading_type, stacked_pallets, receiving_carton_per_pallet,
    hts_code, hts_duty, hts_type, hts_product_subtype,

    fob_current_cost_value, fob_current_cost_start_date, fob_current_cost_update_commentary,
    exw_current_cost_value, exw_current_cost_start_date, exw_current_cost_update_commentary,
    ddp_current_cost_value, ddp_current_cost_start_date, ddp_current_cost_update_commentary,
    cnf_diff_current_cost_value, cnf_diff_current_cost_start_date, cnf_diff_current_cost_update_commentary,
    cnf_current_cost_value, cnf_current_cost_start_date, cnf_current_cost_update_commentary,

    mrsp, commission_percentage, commission_amount,
    duty_percentage, fixed_duty_per_piece, duty_cost, tariff,
    max_carton_per_weight, max_case_pack_per_weight,

    confirmed_carton_per_40hc, calculated_cartons_40hc_per_volume, calculated_case_pack_40hc_per_volume,
    optimal_cartons_per_40hc, optimal_pieces_per_40hc,

    confirmed_carton_per_45hc, calculated_cartons_45hc_per_volume, calculated_case_pack_45hc_per_volume,
    optimal_cartons_per_45hc, optimal_pieces_per_45hc,

    confirmed_carton_per_40std, calculated_cartons_40std_per_volume, calculated_case_pack_40std_per_volume,
    optimal_cartons_per_40std, optimal_pieces_per_40std,

    confirmed_carton_per_20std, calculated_cartons_20std_per_volume, calculated_case_pack_20std_per_volume,
    optimal_cartons_per_20std, optimal_pieces_per_20std,

    confirmed_carton_per_53ft, calculated_cartons_53ft_per_volume, calculated_case_pack_53ft_per_volume,
    optimal_cartons_per_53ft, optimal_pieces_per_53ft,

    logistic_cost_40hc, logistic_cost_45hc, logistic_cost_40std, logistic_cost_20std, logistic_cost_53ft,
    landed_cost_40hc, landed_cost_45hc, landed_cost_40std, landed_cost_20std, landed_cost_53ft
)
SELECT 
    k.tech_sku_id,
    k.cn_code,
    k.status,
    k.image_in_process,
    k.factory_code,
    k.factory_mold,
    k.project_id,
    k.item_upc,
    k.case_upc,
    k.vendor,
    k.brand_name,
    k.origin_country,
    k.pre_price,
    k.factory_name,
    k.description,
    k.short_description,
    k.super_category,
    k.category,
    k.sub_category,
    k.consumer_use,
    k.set_collection,
    k.product_collection,
    k.process_type,
    k.season,
    k.color_family,
    k.color_description,
    k.pantone_code,
    k.tosaf_code,
    k.raw_material,
    k.finishing,
    k.shipping_pack,
    k.label,
    k.packing,
    k.pieces_per_unit,
    k.case_pack,
    k.pieces_per_unit*k.case_pack,
    k.carton_per_american_pallet,
    COALESCE(k.carton_per_american_pallet, cpap_k.carton_per_american_pallet, est_k.optimal_carton_per_pallet),
    k.ti,
    k.hi,
    k.product_or_kit,
    k.notes,

    k.product_length_mm,
    k.product_height_mm,
    k.product_width_mm,
    k.product_weight_kg,
    k.product_volume_ml,

    ROUND((k.product_length_mm/25.4)::numeric, 2),
    ROUND((k.product_height_mm/25.4)::numeric, 2),
    ROUND((k.product_width_mm/25.4)::numeric, 2),
    ROUND((k.product_weight_kg*2.204)::numeric, 2),
    ROUND((k.product_volume_ml*0.033814)::numeric, 2),

    k.set_length_mm,
    k.set_height_mm,
    k.set_width_mm,
    k.set_weight_kg,

    ROUND((k.set_weight_kg*2.204)::numeric, 2),
    ROUND((k.set_length_mm/25.4)::numeric, 2),
    ROUND((k.set_height_mm/25.4)::numeric, 2),
    ROUND((k.set_width_mm/25.4)::numeric, 2),

    k.carton_length_mm,
    k.carton_height_mm,
    k.carton_width_mm,
    ROUND((k.carton_weight_kg)::numeric,2),
    ROUND((bd_k.carton_length_in)::numeric,2),
    ROUND((bd_k.carton_height_in)::numeric,2),
    ROUND((bd_k.carton_width_in)::numeric,2),
    ROUND((bd_k.carton_weight_lb)::numeric,2),

    k.pieces_per_polybag,
    k.polybag_per_pallet,
    k.polybag_pallet_type,
    k.polybag_product_pallets_per_40hc,
    k.polybag_product_pallets_per_45hc,
    k.polybag_product_pallets_per_40std,
    k.polybag_product_pallets_per_20std,
    k.polybag_product_pallets_per_53ft,

    k.polybag_length_mm,
    k.polybag_width_mm,
    k.polybag_height_mm,
    ROUND((k.polybag_length_mm/25.4)::numeric,2),
    ROUND((k.polybag_width_mm/25.4)::numeric,2),
    ROUND((k.polybag_height_mm/25.4)::numeric,2),

    k.polybag_to_carton_length_mm,
    k.polybag_to_carton_width_mm,
    k.polybag_to_carton_height_mm,
    ROUND((k.polybag_to_carton_length_mm/25.4)::numeric,2),
    ROUND((k.polybag_to_carton_width_mm/25.4)::numeric,2),
    ROUND((k.polybag_to_carton_height_mm/25.4)::numeric,2),

    ROUND((bd_k.case_cbm)::numeric,4),
    k.cbm_const,
    ROUND(((bd_k.case_cbm*35.315))::numeric,4),

    k.loading_type,
    k.stacked_pallets,
    k.receiving_carton_per_pallet,

    p_hts.hts_code,
    p_hts.hts_duty,
    p_hts.hts_type,
    p_hts.hts_product_subtype,

    k.fob,
    NULL,
    NULL,
    k.exw,
    NULL,
    NULL,
    k.ddp,
    NULL,
    NULL,
    k.cnf_diff,
    NULL,
    NULL,
    k.cnf,
    NULL,
    NULL,

    k.mrsp,
    k.commission_percentage,
    comi.commission_amount,

    NULL,NULL,NULL,NULL,

    FLOOR(mw.value/k.carton_weight_kg),
    FLOOR(mw.value/k.carton_weight_kg)*k.case_pack,

    k.confirmed_carton_per_40hc,
    c40_k.calculated_cartons_40hc_per_volume,
    c40_k.calculated_case_pack_40hc_per_volume,
    c40_k.optimal_cartons_per_40hc,
    c40_k.optimal_pieces_per_40hc,

    k.confirmed_carton_per_45hc,
    c45_k.calculated_cartons_45hc_per_volume,
    c45_k.calculated_case_pack_45hc_per_volume,
    c45_k.optimal_cartons_per_45hc,
    c45_k.optimal_pieces_per_45hc,

    k.confirmed_carton_per_40std,
    c40s_k.calculated_cartons_40std_per_volume,
    c40s_k.calculated_case_pack_40std_per_volume,
    c40s_k.optimal_cartons_per_40std,
    c40s_k.optimal_pieces_per_40std,

    k.confirmed_carton_per_20std,
    c20_k.calculated_cartons_20std_per_volume,
    c20_k.calculated_case_pack_20std_per_volume,
    c20_k.optimal_cartons_per_20std,
    c20_k.optimal_pieces_per_20std,

    k.confirmed_carton_per_53ft,
    c53_k.calculated_cartons_53ft_per_volume,
    c53_k.calculated_case_pack_53ft_per_volume,
    c53_k.optimal_cartons_per_53ft,
    c53_k.optimal_pieces_per_53ft,

    NULL,NULL,NULL,NULL,NULL,

    kac.kit_cost_40hc,
    kac.kit_cost_45hc,
    kac.kit_cost_40std,
    kac.kit_cost_20std,
    kac.kit_cost_53ft
FROM public.product k
CROSS JOIN int.maximum_weight_in_container mw
LEFT JOIN int.calc_carton_dims bd_k ON bd_k.tech_sku_id = k.tech_sku_id
LEFT JOIN int.product_hts p_hts ON p_hts.tech_sku_id = k.tech_sku_id
LEFT JOIN int.common_cpap cpap_k ON LOWER(k.factory_mold) = LOWER(cpap_k.mold_key) AND k.case_pack = cpap_k.case_pack
LEFT JOIN int.estimated_optimal_cpap est_k ON est_k.tech_sku_id = k.tech_sku_id
LEFT JOIN int.calc_40hc c40_k ON c40_k.tech_sku_id = k.tech_sku_id
LEFT JOIN int.calc_45hc c45_k ON c45_k.tech_sku_id = k.tech_sku_id
LEFT JOIN int.calc_40std c40s_k ON c40s_k.tech_sku_id = k.tech_sku_id
LEFT JOIN int.calc_20std c20_k ON c20_k.tech_sku_id = k.tech_sku_id
LEFT JOIN int.calc_53ft c53_k ON c53_k.tech_sku_id = k.tech_sku_id
LEFT JOIN int.kit_landed_cost kac ON kac.tech_sku_id_kit = k.tech_sku_id
LEFT JOIN int.product_commission comi ON k.tech_sku_id = comi.tech_sku_id
WHERE k.product_or_kit = 'KIT';
