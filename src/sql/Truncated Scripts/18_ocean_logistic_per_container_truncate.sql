TRUNCATE int.ocean_logistic_cost40hc;

INSERT INTO int.ocean_logistic_cost40hc (tech_sku_id, ocean_logistic_cost40hc)
SELECT
    p.tech_sku_id,
    CASE lic.incoterm
        WHEN 'FOB' THEN ROUND(((rpc.value + eic.value + ppc.value + ofp.value + di.value)
                                / NULLIF(c40.optimal_pieces_per_40hc, 0))::numeric, 3)
        WHEN 'EXW' THEN ROUND(((rpc.value + eic.value + ppc.value + ofp.value + di.value + oi.value)
                                / NULLIF(c40.optimal_pieces_per_40hc, 0))::numeric, 3)
        WHEN 'DDP' THEN ROUND(((rpc.value + eic.value + ppc.value)
                                / NULLIF(c40.optimal_pieces_per_40hc, 0))::numeric, 3)
        WHEN 'CNF' THEN ROUND(((rpc.value + eic.value + ppc.value + di.value)
                                / NULLIF(c40.optimal_pieces_per_40hc, 0))::numeric, 3)
        WHEN 'CNF_DIFF' THEN ROUND(((rpc.value + eic.value + ppc.value + di.value + oi.value)
                                / NULLIF(c40.optimal_pieces_per_40hc, 0))::numeric, 3)
    END
FROM public.product p
CROSS JOIN int.realese_port_cost rpc
CROSS JOIN int.exams_insuarance_port_cost eic
CROSS JOIN int.pallets_port_cost ppc
LEFT JOIN int.calc_40hc c40
    ON c40.tech_sku_id = p.tech_sku_id
LEFT JOIN public.incoterm_cost_group lic
    ON UPPER(p.origin_country) = UPPER(lic.country)
   AND UPPER(p.vendor) = UPPER(lic.vendor)
   AND UPPER(lic.cost_group) = 'LOGISTIC'
LEFT JOIN int.vendor_main_port op
    ON UPPER(op.country) = UPPER(p.origin_country)
   AND UPPER(op.vendor) = UPPER(p.vendor)
LEFT JOIN int.vendor_main_port dp
    ON UPPER(dp.country) = 'UNITED STATES'
   AND UPPER(dp.vendor) = 'HEMISPHERE'
LEFT JOIN public.ocean_freights_parameters ofp
    ON UPPER(ofp.origin_country) = UPPER(p.origin_country)
   AND UPPER(ofp.destination_country) = 'UNITED STATES'
   AND UPPER(ofp.origin_port) = UPPER(op.port)
   AND UPPER(ofp.destination_port) = UPPER(dp.port)
   AND UPPER(ofp.container_type) = '40HC'
   AND ofp.start_date::date <= CURRENT_DATE
   AND ofp.end_date::date > CURRENT_DATE
LEFT JOIN public.inland_parameters oi
    ON UPPER(oi.country) = UPPER(p.origin_country)
   AND UPPER(oi.inland_type) = 'ORIGIN'
   AND UPPER(oi.port) = UPPER(op.port)
   AND oi.start_date::date <= CURRENT_DATE
   AND oi.end_date::date > CURRENT_DATE
LEFT JOIN public.inland_parameters di
    ON UPPER(di.country) = 'UNITED STATES'
   AND UPPER(di.inland_type) = 'DESTINATION'
   AND UPPER(di.port) = UPPER(dp.port)
   AND di.start_date::date <= CURRENT_DATE
   AND di.end_date::date > CURRENT_DATE;


TRUNCATE int.ocean_logistic_cost45hc;

INSERT INTO int.ocean_logistic_cost45hc (tech_sku_id, ocean_logistic_cost45hc)
SELECT
    p.tech_sku_id,
    CASE lic.incoterm
        WHEN 'FOB' THEN ROUND(((rpc.value + eic.value + ppc.value + ofp.value + di.value)
                                / NULLIF(c45.optimal_pieces_per_45hc, 0))::numeric, 3)
        WHEN 'EXW' THEN ROUND(((rpc.value + eic.value + ppc.value + ofp.value + di.value + oi.value)
                                / NULLIF(c45.optimal_pieces_per_45hc, 0))::numeric, 3)
        WHEN 'DDP' THEN ROUND(((rpc.value + eic.value + ppc.value)
                                / NULLIF(c45.optimal_pieces_per_45hc, 0))::numeric, 3)
        WHEN 'CNF' THEN ROUND(((rpc.value + eic.value + ppc.value + di.value)
                                / NULLIF(c45.optimal_pieces_per_45hc, 0))::numeric, 3)
        WHEN 'CNF_DIFF' THEN ROUND(((rpc.value + eic.value + ppc.value + di.value + oi.value)
                                / NULLIF(c45.optimal_pieces_per_45hc, 0))::numeric, 3)
    END
FROM public.product p
CROSS JOIN int.realese_port_cost rpc
CROSS JOIN int.exams_insuarance_port_cost eic
CROSS JOIN int.pallets_port_cost ppc
LEFT JOIN int.calc_45hc c45 ON c45.tech_sku_id = p.tech_sku_id
LEFT JOIN public.incoterm_cost_group lic
    ON UPPER(p.origin_country) = UPPER(lic.country)
   AND UPPER(p.vendor) = UPPER(lic.vendor)
   AND UPPER(lic.cost_group) = 'LOGISTIC'
LEFT JOIN int.vendor_main_port op
    ON UPPER(op.country) = UPPER(p.origin_country)
   AND UPPER(op.vendor) = UPPER(p.vendor)
LEFT JOIN int.vendor_main_port dp
    ON UPPER(dp.country) = 'UNITED STATES'
   AND UPPER(dp.vendor) = 'HEMISPHERE'
LEFT JOIN public.ocean_freights_parameters ofp
    ON UPPER(ofp.origin_country) = UPPER(p.origin_country)
   AND UPPER(ofp.destination_country) = 'UNITED STATES'
   AND UPPER(ofp.origin_port) = UPPER(op.port)
   AND UPPER(ofp.destination_port) = UPPER(dp.port)
   AND UPPER(ofp.container_type) = '45HC'
   AND ofp.start_date::date <= CURRENT_DATE
   AND ofp.end_date::date > CURRENT_DATE
LEFT JOIN public.inland_parameters oi
    ON UPPER(oi.country) = UPPER(p.origin_country)
   AND UPPER(oi.inland_type) = 'ORIGIN'
   AND UPPER(oi.port) = UPPER(op.port)
   AND oi.start_date::date <= CURRENT_DATE
   AND oi.end_date::date > CURRENT_DATE
LEFT JOIN public.inland_parameters di
    ON UPPER(di.country) = 'UNITED STATES'
   AND UPPER(di.inland_type) = 'DESTINATION'
   AND UPPER(di.port) = UPPER(dp.port)
   AND di.start_date::date <= CURRENT_DATE
   AND di.end_date::date > CURRENT_DATE;


TRUNCATE int.ocean_logistic_cost40std;

INSERT INTO int.ocean_logistic_cost40std (tech_sku_id, ocean_logistic_cost40std)
SELECT
    p.tech_sku_id,
    CASE lic.incoterm
        WHEN 'FOB' THEN ROUND(((rpc.value + eic.value + ppc.value + ofp.value + di.value)
                                / NULLIF(c40std.optimal_pieces_per_40std, 0))::numeric, 3)
        WHEN 'EXW' THEN ROUND(((rpc.value + eic.value + ppc.value + ofp.value + di.value + oi.value)
                                / NULLIF(c40std.optimal_pieces_per_40std, 0))::numeric, 3)
        WHEN 'DDP' THEN ROUND(((rpc.value + eic.value + ppc.value)
                                / NULLIF(c40std.optimal_pieces_per_40std, 0))::numeric, 3)
        WHEN 'CNF' THEN ROUND(((rpc.value + eic.value + ppc.value + di.value)
                                / NULLIF(c40std.optimal_pieces_per_40std, 0))::numeric, 3)
        WHEN 'CNF_DIFF' THEN ROUND(((rpc.value + eic.value + ppc.value + di.value + oi.value)
                                / NULLIF(c40std.optimal_pieces_per_40std, 0))::numeric, 3)
    END
FROM public.product p
CROSS JOIN int.realese_port_cost rpc
CROSS JOIN int.exams_insuarance_port_cost eic
CROSS JOIN int.pallets_port_cost ppc
LEFT JOIN int.calc_40std c40std
    ON c40std.tech_sku_id = p.tech_sku_id
LEFT JOIN public.incoterm_cost_group lic
    ON UPPER(p.origin_country) = UPPER(lic.country)
   AND UPPER(p.vendor) = UPPER(lic.vendor)
   AND UPPER(lic.cost_group) = 'LOGISTIC'
LEFT JOIN int.vendor_main_port op
    ON UPPER(op.country) = UPPER(p.origin_country)
   AND UPPER(op.vendor) = UPPER(p.vendor)
LEFT JOIN int.vendor_main_port dp
    ON UPPER(dp.country) = 'UNITED STATES'
   AND UPPER(dp.vendor) = 'HEMISPHERE'
LEFT JOIN public.ocean_freights_parameters ofp
    ON UPPER(ofp.origin_country) = UPPER(p.origin_country)
   AND UPPER(ofp.destination_country) = 'UNITED STATES'
   AND UPPER(ofp.origin_port) = UPPER(op.port)
   AND UPPER(ofp.destination_port) = UPPER(dp.port)
   AND UPPER(ofp.container_type) = '40STD'
   AND ofp.start_date::date <= CURRENT_DATE
   AND ofp.end_date::date > CURRENT_DATE
LEFT JOIN public.inland_parameters oi
    ON UPPER(oi.country) = UPPER(p.origin_country)
   AND UPPER(oi.inland_type) = 'ORIGIN'
   AND UPPER(oi.port) = UPPER(op.port)
   AND oi.start_date::date <= CURRENT_DATE
   AND oi.end_date::date > CURRENT_DATE
LEFT JOIN public.inland_parameters di
    ON UPPER(di.country) = 'UNITED STATES'
   AND UPPER(di.inland_type) = 'DESTINATION'
   AND UPPER(di.port) = UPPER(dp.port)
   AND di.start_date::date <= CURRENT_DATE
   AND di.end_date::date > CURRENT_DATE;


TRUNCATE int.ocean_logistic_cost20std;

INSERT INTO int.ocean_logistic_cost20std (tech_sku_id, ocean_logistic_cost20std)
SELECT
    p.tech_sku_id,
    CASE lic.incoterm
        WHEN 'FOB' THEN ROUND(((rpc.value + eic.value + ppc.value + ofp.value + di.value)
                                / NULLIF(c20std.optimal_pieces_per_20std, 0))::numeric, 3)
        WHEN 'EXW' THEN ROUND(((rpc.value + eic.value + ppc.value + ofp.value + di.value + oi.value)
                                / NULLIF(c20std.optimal_pieces_per_20std, 0))::numeric, 3)
        WHEN 'DDP' THEN ROUND(((rpc.value + eic.value + ppc.value)
                                / NULLIF(c20std.optimal_pieces_per_20std, 0))::numeric, 3)
        WHEN 'CNF' THEN ROUND(((rpc.value + eic.value + ppc.value + di.value)
                                / NULLIF(c20std.optimal_pieces_per_20std, 0))::numeric, 3)
        WHEN 'CNF_DIFF' THEN ROUND(((rpc.value + eic.value + ppc.value + di.value + oi.value)
                                / NULLIF(c20std.optimal_pieces_per_20std, 0))::numeric, 3)
    END
FROM public.product p
CROSS JOIN int.realese_port_cost rpc
CROSS JOIN int.exams_insuarance_port_cost eic
CROSS JOIN int.pallets_port_cost ppc
LEFT JOIN int.calc_20std c20std
    ON c20std.tech_sku_id = p.tech_sku_id
LEFT JOIN public.incoterm_cost_group lic
    ON UPPER(p.origin_country) = UPPER(lic.country)
   AND UPPER(p.vendor) = UPPER(lic.vendor)
   AND UPPER(lic.cost_group) = 'LOGISTIC'
LEFT JOIN int.vendor_main_port op
    ON UPPER(op.country) = UPPER(p.origin_country)
   AND UPPER(op.vendor) = UPPER(p.vendor)
LEFT JOIN int.vendor_main_port dp
    ON UPPER(dp.country) = 'UNITED STATES'
   AND UPPER(dp.vendor) = 'HEMISPHERE'
LEFT JOIN public.ocean_freights_parameters ofp
    ON UPPER(ofp.origin_country) = UPPER(p.origin_country)
   AND UPPER(ofp.destination_country) = 'UNITED STATES'
   AND UPPER(ofp.origin_port) = UPPER(op.port)
   AND UPPER(ofp.destination_port) = UPPER(dp.port)
   AND UPPER(ofp.container_type) = '20STD'
   AND ofp.start_date::date <= CURRENT_DATE
   AND ofp.end_date::date > CURRENT_DATE
LEFT JOIN public.inland_parameters oi
    ON UPPER(oi.country) = UPPER(p.origin_country)
   AND UPPER(oi.inland_type) = 'ORIGIN'
   AND UPPER(oi.port) = UPPER(op.port)
   AND oi.start_date::date <= CURRENT_DATE
   AND oi.end_date::date > CURRENT_DATE
LEFT JOIN public.inland_parameters di
    ON UPPER(di.country) = 'UNITED STATES'
   AND UPPER(di.inland_type) = 'DESTINATION'
   AND UPPER(di.port) = UPPER(dp.port)
   AND di.start_date::date <= CURRENT_DATE
   AND di.end_date::date > CURRENT_DATE;


TRUNCATE int.ocean_logistic_cost53ft;

INSERT INTO int.ocean_logistic_cost53ft (tech_sku_id, ocean_logistic_cost53ft)
SELECT
    p.tech_sku_id,
    CASE lic.incoterm
        WHEN 'FOB' THEN ROUND(((rpc.value + eic.value + ppc.value + ofp.value + di.value)
                                / NULLIF(c53ft.optimal_pieces_per_53ft, 0))::numeric, 3)
        WHEN 'EXW' THEN ROUND(((rpc.value + eic.value + ppc.value + ofp.value + di.value + oi.value)
                                / NULLIF(c53ft.optimal_pieces_per_53ft, 0))::numeric, 3)
        WHEN 'DDP' THEN ROUND(((rpc.value + eic.value + ppc.value)
                                / NULLIF(c53ft.optimal_pieces_per_53ft, 0))::numeric, 3)
        WHEN 'CNF' THEN ROUND(((rpc.value + eic.value + ppc.value + di.value)
                                / NULLIF(c53ft.optimal_pieces_per_53ft, 0))::numeric, 3)
        WHEN 'CNF_DIFF' THEN ROUND(((rpc.value + eic.value + ppc.value + di.value + oi.value)
                                / NULLIF(c53ft.optimal_pieces_per_53ft, 0))::numeric, 3)
    END
FROM public.product p
CROSS JOIN int.realese_port_cost rpc
CROSS JOIN int.exams_insuarance_port_cost eic
CROSS JOIN int.pallets_port_cost ppc
LEFT JOIN int.calc_53ft c53ft
    ON c53ft.tech_sku_id = p.tech_sku_id
LEFT JOIN public.incoterm_cost_group lic
    ON UPPER(p.origin_country) = UPPER(lic.country)
   AND UPPER(p.vendor) = UPPER(lic.vendor)
   AND UPPER(lic.cost_group) = 'LOGISTIC'
LEFT JOIN int.vendor_main_port op
    ON UPPER(op.country) = UPPER(p.origin_country)
   AND UPPER(op.vendor) = UPPER(p.vendor)
LEFT JOIN int.vendor_main_port dp
    ON UPPER(dp.country) = 'UNITED STATES'
   AND UPPER(dp.vendor) = 'HEMISPHERE'
LEFT JOIN public.ocean_freights_parameters ofp
    ON UPPER(ofp.origin_country) = UPPER(p.origin_country)
   AND UPPER(ofp.destination_country) = 'UNITED STATES'
   AND UPPER(ofp.origin_port) = UPPER(op.port)
   AND UPPER(ofp.destination_port) = UPPER(dp.port)
   AND UPPER(ofp.container_type) = '53FT'
   AND ofp.start_date::date <= CURRENT_DATE
   AND ofp.end_date::date > CURRENT_DATE
LEFT JOIN public.inland_parameters oi
    ON UPPER(oi.country) = UPPER(p.origin_country)
   AND UPPER(oi.inland_type) = 'ORIGIN'
   AND UPPER(oi.port) = UPPER(op.port)
   AND oi.start_date::date <= CURRENT_DATE
   AND oi.end_date::date > CURRENT_DATE
LEFT JOIN public.inland_parameters di
    ON UPPER(di.country) = 'UNITED STATES'
   AND UPPER(di.inland_type) = 'DESTINATION'
   AND UPPER(di.port) = UPPER(dp.port)
   AND di.start_date::date <= CURRENT_DATE
   AND di.end_date::date > CURRENT_DATE;
