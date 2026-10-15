TRUNCATE int.product_view;

INSERT INTO int.product_view
SELECT 
    p.tech_sku_id,
    p.hemicode,
    p.status,
    p.image_in_process,
    p.factory_code,
    p.factory_mold,
    p.project_id,
    p.item_upc,
    p.case_upc,
    p.vendor,
    p.brand_name,
    p.origin_country,
    p.pre_price,
    p.factory_name,
    p.description,
    p.short_description,
    p.super_category,
    p.category,
    p.sub_category,
    p.consumer_use,
    p.set_collection,
    p.product_collection,
    p.process_type,
    p.season,
    p.color_family,
    p.color_description,
    p.pantone_code,
    p.tosaf_code,
    p.raw_material,
    p.finishing,
    p.shipping_pack,
    p.label,
    p.packing,
    p.pieces_per_unit,
    p.case_pack,
    p.pieces_per_unit * p.case_pack AS pieces_per_carton,
    p.carton_per_american_pallet,

    COALESCE(
        p.carton_per_american_pallet,
        cpap.carton_per_american_pallet,
        est_cpap.optimal_carton_per_pallet
    ),

    p.ti,
    p.hi,
    p.product_or_kit,
    p.notes,

    p.product_length_mm,
    p.product_height_mm,
    p.product_width_mm,
    p.product_weight_kg,
    p.product_volume_ml,
    ROUND((p.product_length_mm / 25.4)::numeric, 2),
    ROUND((p.product_height_mm / 25.4)::numeric, 2),
    ROUND((p.product_width_mm / 25.4)::numeric, 2),
    ROUND((p.product_weight_kg * 2.204)::numeric, 2),
    ROUND((p.product_volume_ml * 0.033814)::numeric, 2),

    p.set_length_mm,
    p.set_height_mm,
    p.set_width_mm,
    p.set_weight_kg,
    ROUND((p.set_weight_kg * 2.204)::numeric, 2),
    ROUND((p.set_length_mm / 25.4)::numeric, 2),
    ROUND((p.set_height_mm / 25.4)::numeric, 2),
    ROUND((p.set_width_mm / 25.4)::numeric, 2),

    p.carton_length_mm,
    p.carton_height_mm,
    p.carton_width_mm,
    ROUND(p.carton_weight_kg::numeric, 2),
    ROUND(bd.carton_length_in::numeric, 2),
    ROUND(bd.carton_height_in::numeric, 2),
    ROUND(bd.carton_width_in::numeric, 2),
    ROUND(bd.carton_weight_lb::numeric, 2),

    p.pieces_per_polybag,
    p.polybag_per_pallet,
    p.polybag_pallet_type,
    p.polybag_product_pallets_per_40hc,
    p.polybag_product_pallets_per_45hc,
    p.polybag_product_pallets_per_40std,
    p.polybag_product_pallets_per_20std,
    p.polybag_product_pallets_per_53ft,

    p.polybag_length_mm,
    p.polybag_width_mm,
    p.polybag_height_mm,
    ROUND((p.polybag_length_mm / 25.4)::numeric, 2),
    ROUND((p.polybag_width_mm / 25.4)::numeric, 2),
    ROUND((p.polybag_height_mm / 25.4)::numeric, 2),

    p.polybag_to_carton_length_mm,
    p.polybag_to_carton_width_mm,
    p.polybag_to_carton_height_mm,
    ROUND((p.polybag_to_carton_length_mm / 25.4)::numeric, 2),
    ROUND((p.polybag_to_carton_width_mm / 25.4)::numeric, 2),
    ROUND((p.polybag_to_carton_height_mm / 25.4)::numeric, 2),

    ROUND(bd.case_cbm::numeric, 4),
    p.cbm_const,
    ROUND((bd.case_cbm * 35.315)::numeric, 4),

    p.loading_type,
    p.stacked_pallets,
    p.receiving_carton_per_pallet,

    p_hts.hts_code,
    p_hts.hts_duty,
    p_hts.hts_type,
    p_hts.hts_product_subtype,

    ROUND(COALESCE(cpc.fob_current_cost_value, p.fob)::numeric, 3),
    cpc.fob_current_cost_start_date,
    cpc.fob_current_cost_update_commentary,

    ROUND(COALESCE(cpc.exw_current_cost_value, p.exw)::numeric, 3),
    cpc.exw_current_cost_start_date,
    cpc.exw_current_cost_update_commentary,

    ROUND(COALESCE(cpc.ddp_current_cost_value, p.ddp)::numeric, 3),
    cpc.ddp_current_cost_start_date,
    cpc.ddp_current_cost_update_commentary,

    ROUND(COALESCE(cpc.cnf_diff_current_cost_value, p.cnf_diff)::numeric, 3),
    cpc.cnf_diff_current_cost_start_date,
    cpc.cnf_diff_current_cost_update_commentary,

    ROUND(COALESCE(cpc.cnf_current_cost_value, p.cnf)::numeric, 3),
    cpc.cnf_current_cost_start_date,
    cpc.cnf_current_cost_update_commentary,

    p.mrsp,
    p.commission_percentage,
    comi.commission_amount,

    ROUND(td.duty_percentage::numeric, 4),
    td.fixed_duty_per_piece,
    ROUND(td.duty_cost::numeric, 3),

    ROUND(tarf.tariff::numeric, 3),

    FLOOR(mw.value / NULLIF(p.carton_weight_kg, 0)),
    FLOOR(mw.value / NULLIF(p.carton_weight_kg, 0)) * p.case_pack,

    p.confirmed_carton_per_40hc,
    c40.calculated_cartons_40hc_per_volume,
    c40.calculated_case_pack_40hc_per_volume,
    c40.optimal_cartons_per_40hc,
    c40.optimal_pieces_per_40hc,

    p.confirmed_carton_per_45hc,
    c45.calculated_cartons_45hc_per_volume,
    c45.calculated_case_pack_45hc_per_volume,
    c45.optimal_cartons_per_45hc,
    c45.optimal_pieces_per_45hc,

    p.confirmed_carton_per_40std,
    c40s.calculated_cartons_40std_per_volume,
    c40s.calculated_case_pack_40std_per_volume,
    c40s.optimal_cartons_per_40std,
    c40s.optimal_pieces_per_40std,

    p.confirmed_carton_per_20std,
    c20.calculated_cartons_20std_per_volume,
    c20.calculated_case_pack_20std_per_volume,
    c20.optimal_cartons_per_20std,
    c20.optimal_pieces_per_20std,

    p.confirmed_carton_per_53ft,
    c53.calculated_cartons_53ft_per_volume,
    c53.calculated_case_pack_53ft_per_volume,
    c53.optimal_cartons_per_53ft,
    c53.optimal_pieces_per_53ft,

    log_40hc.logistic_cost_40hc,
    log_45hc.logistic_cost_45hc,
    log_40std.logistic_cost_40std,
    log_20std.logistic_cost_20std,
    log_53ft.logistic_cost_53ft,

    lc40hc.landed_cost_40hc,
    lc45hc.landed_cost_45hc,
    lc40std.landed_cost_40std,
    lc20std.landed_cost_20std,
    lc53ft.landed_cost_53ft

FROM public.product p
CROSS JOIN int.maximum_weight_in_container mw
LEFT JOIN int.current_product_costs    cpc ON cpc.tech_sku_id = p.tech_sku_id
INNER JOIN int.calc_carton_dims          bd  ON bd.tech_sku_id = p.tech_sku_id
INNER JOIN int.product_hts            p_hts ON p_hts.tech_sku_id = p.tech_sku_id
INNER JOIN int.calc_duties            td  ON td.tech_sku_id = p.tech_sku_id
INNER JOIN int.calc_tariff            tarf ON tarf.tech_sku_id = p.tech_sku_id
INNER JOIN int.calc_40hc              c40  ON c40.tech_sku_id = p.tech_sku_id
INNER JOIN int.calc_45hc              c45  ON c45.tech_sku_id = p.tech_sku_id
INNER JOIN int.calc_40std             c40s ON c40s.tech_sku_id = p.tech_sku_id
INNER JOIN int.calc_20std             c20  ON c20.tech_sku_id = p.tech_sku_id
INNER JOIN int.calc_53ft              c53  ON c53.tech_sku_id = p.tech_sku_id
INNER JOIN int.logistic_cost_40hc     log_40hc ON log_40hc.tech_sku_id = p.tech_sku_id
INNER JOIN int.logistic_cost_45hc     log_45hc ON log_45hc.tech_sku_id = p.tech_sku_id
INNER JOIN int.logistic_cost_40std    log_40std ON log_40std.tech_sku_id = p.tech_sku_id
INNER JOIN int.logistic_cost_20std    log_20std ON log_20std.tech_sku_id = p.tech_sku_id
INNER JOIN int.logistic_cost_53ft     log_53ft ON log_53ft.tech_sku_id = p.tech_sku_id
INNER JOIN int.landed_cost_40hc       lc40hc ON lc40hc.tech_sku_id = p.tech_sku_id
INNER JOIN int.landed_cost_45hc       lc45hc ON lc45hc.tech_sku_id = p.tech_sku_id
INNER JOIN int.landed_cost_40std      lc40std ON lc40std.tech_sku_id = p.tech_sku_id
INNER JOIN int.landed_cost_20std      lc20std ON lc20std.tech_sku_id = p.tech_sku_id
INNER JOIN int.landed_cost_53ft       lc53ft ON lc53ft.tech_sku_id = p.tech_sku_id
LEFT JOIN int.common_cpap             cpap ON LOWER(p.factory_mold) = cpap.mold_key AND p.case_pack = cpap.case_pack
INNER JOIN int.estimated_optimal_cpap est_cpap ON est_cpap.tech_sku_id = p.tech_sku_id
INNER JOIN int.product_commission     comi ON comi.tech_sku_id = p.tech_sku_id
WHERE p.product_or_kit IN ('PRODUCT', 'PRODUCT_KIT_SELLABLE');
