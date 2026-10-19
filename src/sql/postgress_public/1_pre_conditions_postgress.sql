-- Crear schema intermedio si no existe
CREATE SCHEMA IF NOT EXISTS int;

-- CTE / parámetros simples

DROP TABLE IF EXISTS int.habour_maintenance_fee;
SELECT value
INTO int.habour_maintenance_fee
FROM dev.other_parameters
WHERE parameter = 'habour_maintenance_fee';

DROP TABLE IF EXISTS int.merchandise_processing_fee;
SELECT value
INTO int.merchandise_processing_fee
FROM dev.other_parameters
WHERE parameter = 'merchandise_processing_fee';

DROP TABLE IF EXISTS int.maximum_weight_in_container;
SELECT value
INTO int.maximum_weight_in_container
FROM dev.other_parameters
WHERE parameter = 'maximum_weight_in_container';

DROP TABLE IF EXISTS int.max_capacity_40hc_cbm;
SELECT value
INTO int.max_capacity_40hc_cbm
FROM dev.other_parameters
WHERE parameter = 'max_capacity_40hc_cbm';

DROP TABLE IF EXISTS int.max_capacity_45hc_cbm;
SELECT value
INTO int.max_capacity_45hc_cbm
FROM dev.other_parameters
WHERE parameter = 'max_capacity_45hc_cbm';

DROP TABLE IF EXISTS int.max_capacity_40std_cbm;
SELECT value
INTO int.max_capacity_40std_cbm
FROM dev.other_parameters
WHERE parameter = 'max_capacity_40std_cbm';

DROP TABLE IF EXISTS int.max_capacity_20std_cbm;
SELECT value
INTO int.max_capacity_20std_cbm
FROM dev.other_parameters
WHERE parameter = 'max_capacity_20std_cbm';

DROP TABLE IF EXISTS int.max_capacity_53ft_cbm;
SELECT value
INTO int.max_capacity_53ft_cbm
FROM dev.other_parameters
WHERE parameter = 'max_capacity_53ft_cbm';

DROP TABLE IF EXISTS int.realese_port_cost;
SELECT value
INTO int.realese_port_cost
FROM dev.port_cost_parameters
WHERE logistic_cost = 'RELEASE'
  AND start_date <= CURRENT_DATE
  AND end_date   > CURRENT_DATE;

DROP TABLE IF EXISTS int.exams_insuarance_port_cost;
SELECT value
INTO int.exams_insuarance_port_cost
FROM dev.port_cost_parameters
WHERE logistic_cost = 'EXAMS_INSURANCE'
  AND start_date <= CURRENT_DATE
  AND end_date   > CURRENT_DATE;

DROP TABLE IF EXISTS int.pallets_port_cost;
SELECT value
INTO int.pallets_port_cost
FROM dev.port_cost_parameters
WHERE logistic_cost = 'PALLETS'
  AND start_date <= CURRENT_DATE
  AND end_date   > CURRENT_DATE;

DROP TABLE IF EXISTS int.vendor_main_port;
SELECT
  UPPER(vendor)  AS vendor,
  UPPER(country) AS country,
  MIN(port)      AS port
INTO int.vendor_main_port
FROM dev.vendor_ports
WHERE main_port = TRUE
GROUP BY UPPER(vendor), UPPER(country);

DROP TABLE IF EXISTS int.vigent_product_cost_per_incoterm;
SELECT
  phc.tech_sku_id,
  phc.import_incoterm,
  phc.cost,
  phc.start_date,
  phc.end_date,
  phc.cost_update_commentary,
  ROW_NUMBER() OVER (
    PARTITION BY phc.tech_sku_id, phc.import_incoterm
    ORDER BY phc.start_date DESC, phc.end_date DESC
  ) AS rn
INTO int.vigent_product_cost_per_incoterm
FROM dev.product_historic_costs phc
WHERE phc.start_date <= CURRENT_DATE
  AND (CURRENT_DATE < phc.end_date OR phc.end_date IS NULL);

DROP TABLE IF EXISTS int.current_product_costs;
CREATE TABLE int.current_product_costs AS
SELECT
  tech_sku_id,

  ROUND(MAX(CASE WHEN import_incoterm = 'FOB'      THEN cost END)::numeric, 3) AS fob_current_cost_value,
  MAX(CASE WHEN import_incoterm = 'FOB'      THEN start_date END)             AS fob_current_cost_start_date,
  MAX(CASE WHEN import_incoterm = 'FOB'      THEN end_date END)               AS fob_current_cost_end_date,
  MAX(CASE WHEN import_incoterm = 'FOB'      THEN cost_update_commentary END) AS fob_current_cost_update_commentary,

  ROUND(MAX(CASE WHEN import_incoterm = 'EXW' THEN cost END)::numeric, 3)     AS exw_current_cost_value,
  MAX(CASE WHEN import_incoterm = 'EXW' THEN start_date END)                  AS exw_current_cost_start_date,
  MAX(CASE WHEN import_incoterm = 'EXW' THEN end_date END)                    AS exw_current_cost_end_date,
  MAX(CASE WHEN import_incoterm = 'EXW' THEN cost_update_commentary END)      AS exw_current_cost_update_commentary,

  ROUND(MAX(CASE WHEN import_incoterm = 'DDP' THEN cost END)::numeric, 3)     AS ddp_current_cost_value,
  MAX(CASE WHEN import_incoterm = 'DDP' THEN start_date END)                  AS ddp_current_cost_start_date,
  MAX(CASE WHEN import_incoterm = 'DDP' THEN end_date END)                    AS ddp_current_cost_end_date,
  MAX(CASE WHEN import_incoterm = 'DDP' THEN cost_update_commentary END)      AS ddp_current_cost_update_commentary,

  ROUND(MAX(CASE WHEN import_incoterm = 'CNF_DIFF' THEN cost END)::numeric, 3) AS cnf_diff_current_cost_value,
  MAX(CASE WHEN import_incoterm = 'CNF_DIFF' THEN start_date END)              AS cnf_diff_current_cost_start_date,
  MAX(CASE WHEN import_incoterm = 'CNF_DIFF' THEN end_date END)                AS cnf_diff_current_cost_end_date,
  MAX(CASE WHEN import_incoterm = 'CNF_DIFF' THEN cost_update_commentary END)  AS cnf_diff_current_cost_update_commentary,

  ROUND(MAX(CASE WHEN import_incoterm = 'CNF' THEN cost END)::numeric, 3)     AS cnf_current_cost_value,
  MAX(CASE WHEN import_incoterm = 'CNF' THEN start_date END)                  AS cnf_current_cost_start_date,
  MAX(CASE WHEN import_incoterm = 'CNF' THEN end_date END)                    AS cnf_current_cost_end_date,
  MAX(CASE WHEN import_incoterm = 'CNF' THEN cost_update_commentary END)      AS cnf_current_cost_update_commentary

FROM int.vigent_product_cost_per_incoterm
WHERE rn = 1
GROUP BY tech_sku_id;


DROP TABLE IF EXISTS int.hts_fixed;
SELECT *
INTO int.hts_fixed
FROM dev.hts_codes
WHERE LOWER(type) = 'fixed';

DROP TABLE IF EXISTS int.hts_cost;
SELECT *
INTO int.hts_cost
FROM dev.hts_codes
WHERE LOWER(type) = 'cost';

DROP TABLE IF EXISTS int.hts_volume;
SELECT *
INTO int.hts_volume
FROM dev.hts_codes
WHERE LOWER(type) = 'volume';

DROP TABLE IF EXISTS int.product_hts_candidates;
SELECT 
  p.tech_sku_id,    
  COALESCE(hsf.hts_code, hcs.hts_code, hvs.hts_code)        AS hts_code,
  COALESCE(hsf.duty,     hcs.duty,     hvs.duty)            AS hts_duty,
  COALESCE(hsf.type,     hcs.type,     hvs.type)            AS hts_type,
  COALESCE(hsf.hts_product_subtype, hcs.hts_product_subtype, hvs.hts_product_subtype) AS hts_product_subtype,
  COALESCE(hsf.fixed_duty_per_piece, hcs.fixed_duty_per_piece, hvs.fixed_duty_per_piece) AS fixed_duty_per_piece,
  ROW_NUMBER() OVER (
      PARTITION BY p.tech_sku_id
      ORDER BY  CASE 
          WHEN hsf.hts_code IS NOT NULL THEN 1
          WHEN hcs.hts_code IS NOT NULL THEN 2
          WHEN hvs.hts_code IS NOT NULL THEN 3
          ELSE 4
      END
  ) AS row_number
INTO int.product_hts_candidates
FROM dev.product p
LEFT JOIN int.hts_fixed hsf 
    ON hsf.hts_category = p.hts_category
    AND hsf.hts_product_subtype = p.hts_product_subtype
LEFT JOIN int.hts_cost hcs 
    ON hcs.hts_category = p.hts_category
    AND hcs.hts_product_subtype = p.hts_product_subtype
    AND p.fob IS NOT NULL
    AND (p.fob > hcs.min_value AND p.fob <= hcs.max_value)
LEFT JOIN int.hts_volume  hvs 
    ON hvs.hts_category = p.hts_category
    AND hvs.hts_product_subtype = p.hts_product_subtype
    AND p.product_volume_ml IS NOT NULL
    AND (p.product_volume_ml > hvs.min_value AND p.product_volume_ml <= hvs.max_value);

DROP TABLE IF EXISTS int.product_hts;
SELECT
    tech_sku_id,
    hts_code,
    hts_duty,
    hts_type,
    hts_product_subtype,
    fixed_duty_per_piece
INTO int.product_hts
FROM int.product_hts_candidates
WHERE row_number = 1;

-- duty agreements

DROP TABLE IF EXISTS int.vigent_commercial_agreemments;
SELECT
  UPPER(origin_country)      AS origin_country,
  UPPER(destination_country) AS destination_country,
  UPPER(raw_material)        AS raw_material,
  start_date,
  end_date
INTO int.vigent_commercial_agreemments
FROM dev.duties_commercial_agreements dca
WHERE start_date <= CURRENT_DATE
  AND CURRENT_DATE < end_date;

DROP TABLE IF EXISTS int.country_pair_has_all;
SELECT
  origin_country,
  destination_country
INTO int.country_pair_has_all
FROM int.vigent_commercial_agreemments
WHERE raw_material = 'ALL'
GROUP BY origin_country, destination_country;

DROP TABLE IF EXISTS int.all_agreements_max_start_date;
SELECT
  v.origin_country,
  v.destination_country,
  MAX(v.start_date) AS max_start_date
INTO int.all_agreements_max_start_date
FROM int.vigent_commercial_agreemments v
INNER JOIN int.country_pair_has_all a
  ON v.origin_country = a.origin_country
 AND v.destination_country = a.destination_country
WHERE v.raw_material = 'ALL'
GROUP BY v.origin_country, v.destination_country;

DROP TABLE IF EXISTS int.all_agreements_latest_start_date;
SELECT
  v.origin_country,
  v.destination_country,
  v.raw_material,
  v.start_date,
  v.end_date
INTO int.all_agreements_latest_start_date
FROM int.vigent_commercial_agreemments v
INNER JOIN int.all_agreements_max_start_date ms
  ON ms.origin_country      = v.origin_country
 AND ms.destination_country = v.destination_country
 AND ms.max_start_date      = v.start_date
WHERE v.raw_material = 'ALL';

DROP TABLE IF EXISTS int.all_agreements_max_end_date;
SELECT
  origin_country,
  destination_country,
  MAX(end_date) AS max_end_date
INTO int.all_agreements_max_end_date
FROM int.all_agreements_latest_start_date
GROUP BY origin_country, destination_country;

DROP TABLE IF EXISTS int.current_all_agreements;
SELECT
  a.origin_country,
  a.destination_country,
  'ALL' AS raw_material
INTO int.current_all_agreements
FROM int.all_agreements_latest_start_date a
INNER JOIN int.all_agreements_max_end_date me
  ON me.origin_country      = a.origin_country
 AND me.destination_country = a.destination_country
 AND me.max_end_date        = a.end_date
GROUP BY a.origin_country, a.destination_country;

DROP TABLE IF EXISTS int.country_pair_has_material;
SELECT
  v.origin_country,
  v.destination_country,
  v.raw_material,
  v.start_date,
  v.end_date
INTO int.country_pair_has_material
FROM int.vigent_commercial_agreemments v
LEFT JOIN int.country_pair_has_all a
  ON v.origin_country      = a.origin_country
 AND v.destination_country = a.destination_country
WHERE a.origin_country IS NULL;

DROP TABLE IF EXISTS int.material_agreements_max_start_date;
SELECT
  origin_country,
  destination_country,
  raw_material,
  MAX(start_date) AS max_start_date
INTO int.material_agreements_max_start_date
FROM int.country_pair_has_material
GROUP BY origin_country, destination_country, raw_material;

DROP TABLE IF EXISTS int.material_agreements_latest_start_date;
SELECT
  m.origin_country,
  m.destination_country,
  m.raw_material,
  m.start_date,
  m.end_date
INTO int.material_agreements_latest_start_date
FROM int.country_pair_has_material m
INNER JOIN int.material_agreements_max_start_date ms
  ON ms.origin_country      = m.origin_country
 AND ms.destination_country = m.destination_country
 AND ms.raw_material        = m.raw_material
 AND ms.max_start_date      = m.start_date;

DROP TABLE IF EXISTS int.material_agreements_max_end_date;
SELECT
  origin_country,
  destination_country,
  raw_material,
  MAX(end_date) AS max_end_date
INTO int.material_agreements_max_end_date
FROM int.material_agreements_latest_start_date
GROUP BY origin_country, destination_country, raw_material;

DROP TABLE IF EXISTS int.current_material_agreements;
SELECT
  m.origin_country,
  m.destination_country,
  m.raw_material
INTO int.current_material_agreements
FROM int.material_agreements_latest_start_date m
INNER JOIN int.material_agreements_max_end_date me
  ON m.origin_country      = me.origin_country
 AND m.destination_country = me.destination_country
 AND m.raw_material        = me.raw_material
 AND m.end_date            = me.max_end_date
GROUP BY m.origin_country, m.destination_country, m.raw_material;

DROP TABLE IF EXISTS int.current_commercial_agreements;
SELECT
  origin_country,
  destination_country,
  raw_material
INTO int.current_commercial_agreements
FROM int.current_all_agreements
UNION ALL
SELECT
  origin_country,
  destination_country,
  raw_material
FROM int.current_material_agreements;

DROP TABLE IF EXISTS int.vigent_tariff_parameters;
SELECT
  UPPER(origin_country)      AS origin_country,
  UPPER(destination_country) AS destination_country,
  start_date,
  end_date,
  value / 100              AS value,
  duty_dependent
INTO int.vigent_tariff_parameters
FROM dev.tariff_parameters
WHERE start_date <= CURRENT_DATE
  AND CURRENT_DATE < end_date;

DROP TABLE IF EXISTS int.vigent_tariff_max_start_date;
SELECT
  origin_country,
  destination_country,
  MAX(start_date) AS max_start_date
INTO int.vigent_tariff_max_start_date
FROM int.vigent_tariff_parameters
GROUP BY origin_country, destination_country;

DROP TABLE IF EXISTS int.vigent_tariff_latest_start_date;
SELECT
  vt.origin_country,
  vt.destination_country,
  vt.start_date,
  vt.end_date,
  vt.value,
  vt.duty_dependent
INTO int.vigent_tariff_latest_start_date
FROM int.vigent_tariff_parameters vt
JOIN int.vigent_tariff_max_start_date ms
  ON vt.origin_country      = ms.origin_country
 AND vt.destination_country = ms.destination_country
 AND vt.start_date          = ms.max_start_date;

DROP TABLE IF EXISTS int.vigent_tariff_max_end_date;
SELECT
  origin_country,
  destination_country,
  MAX(end_date) AS max_end_date
INTO int.vigent_tariff_max_end_date
FROM int.vigent_tariff_latest_start_date
GROUP BY origin_country, destination_country;

DROP TABLE IF EXISTS int.current_country_tariff;
SELECT
  ls.origin_country,
  ls.destination_country,
  ls.value,
  ls.duty_dependent
INTO int.current_country_tariff
FROM int.vigent_tariff_latest_start_date ls
JOIN int.vigent_tariff_max_end_date me
  ON ls.origin_country      = me.origin_country
 AND ls.destination_country = me.destination_country
 AND ls.end_date            = me.max_end_date;

DROP TABLE IF EXISTS int.vigent_tariff_hts_exceptions;
SELECT
    hts_code,
    UPPER(origin_country) AS origin_country,
    UPPER(destination_country) AS destination_country,
    special_tariff_value / 100 AS value,
    start_date,
    end_date
INTO int.vigent_tariff_hts_exceptions
FROM dev.tariff_hts_exceptions
WHERE cost_group = 'tariff'
  AND CURRENT_DATE >= start_date::date
  AND CURRENT_DATE <  end_date::date;

DROP TABLE IF EXISTS int.product_special_tariff_candidates;
SELECT
    p.tech_sku_id,
    e.value,
    ROW_NUMBER() OVER (
        PARTITION BY p.tech_sku_id
        ORDER BY e.start_date DESC, e.end_date DESC
    ) AS row_number
INTO int.product_special_tariff_candidates
FROM dev.product p
INNER JOIN int.product_hts ph
  ON ph.tech_sku_id = p.tech_sku_id
INNER JOIN int.vigent_tariff_hts_exceptions e
  ON e.hts_code = ph.hts_code
 AND e.origin_country  = UPPER(p.origin_country)
 AND e.destination_country = 'UNITED STATES';

DROP TABLE IF EXISTS int.product_special_tariff;
SELECT tech_sku_id, value
INTO int.product_special_tariff
FROM int.product_special_tariff_candidates
WHERE row_number = 1;

DROP TABLE IF EXISTS int.product_tariff_final;
SELECT
    p.tech_sku_id,
    COALESCE(pst.value, ct.value) AS value
INTO int.product_tariff_final
FROM dev.product p
LEFT JOIN int.product_special_tariff pst
  ON pst.tech_sku_id = p.tech_sku_id
LEFT JOIN int.current_country_tariff ct
  ON ct.origin_country      = UPPER(p.origin_country)
 AND ct.destination_country = 'UNITED STATES';

DROP TABLE IF EXISTS int.calc_duties;
SELECT 
    p.tech_sku_id,
    CASE 
        WHEN cca.origin_country IS NULL
            THEN (mpf.value / 100) + (hmf.value / 100) + (ph.hts_duty / 100)
        ELSE (mpf.value / 100) + (hmf.value / 100)
    END AS duty_percentage,
    ph.fixed_duty_per_piece,
    CASE dic.incoterm
        WHEN 'FOB' THEN 
            p.fob * (
                CASE WHEN cca.origin_country IS NULL
                     THEN (mpf.value / 100) + (hmf.value / 100) + (ph.hts_duty / 100)
                     ELSE (mpf.value / 100) + (hmf.value / 100)
                END
            ) + COALESCE(ph.fixed_duty_per_piece, 0) * p.pieces_per_unit
        WHEN 'EXW' THEN 
            p.exw * (
                CASE WHEN cca.origin_country IS NULL
                     THEN (mpf.value / 100) + (hmf.value / 100) + (ph.hts_duty / 100) 
                     ELSE (mpf.value / 100) + (hmf.value / 100)
                END
            ) + COALESCE(ph.fixed_duty_per_piece, 0) * p.pieces_per_unit
        WHEN 'DDP' THEN 
            p.ddp * (
                CASE WHEN cca.origin_country IS NULL
                     THEN (mpf.value / 100) + (hmf.value / 100) + (ph.hts_duty / 100) 
                     ELSE (mpf.value / 100) + (hmf.value / 100)
                END
            ) + COALESCE(ph.fixed_duty_per_piece, 0) * p.pieces_per_unit
        WHEN 'CNF' THEN 
            p.cnf * (
                CASE WHEN cca.origin_country IS NULL
                     THEN (mpf.value / 100) + (hmf.value / 100) + (ph.hts_duty / 100) 
                     ELSE (mpf.value / 100) + (hmf.value / 100)
                END
            ) + COALESCE(ph.fixed_duty_per_piece, 0) * p.pieces_per_unit
        WHEN 'CNF_DIFF' THEN 
            p.cnf_diff * (
                CASE WHEN cca.origin_country IS NULL
                     THEN (mpf.value / 100) + (hmf.value / 100) + (ph.hts_duty / 100) 
                     ELSE (mpf.value / 100) + (hmf.value / 100)
                END
            ) + COALESCE(ph.fixed_duty_per_piece, 0) * p.pieces_per_unit
    END AS duty_cost
INTO int.calc_duties
FROM dev.product p
CROSS JOIN int.merchandise_processing_fee mpf
CROSS JOIN int.habour_maintenance_fee hmf
LEFT JOIN int.product_hts ph
       ON ph.tech_sku_id = p.tech_sku_id
LEFT JOIN int.current_commercial_agreements cca
       ON  cca.origin_country      = UPPER(p.origin_country)
       AND cca.destination_country = 'UNITED STATES'
       AND (cca.raw_material = 'ALL' OR cca.raw_material = UPPER(p.raw_material))
LEFT JOIN dev.incoterm_cost_group dic
       ON UPPER(p.origin_country)  = UPPER(dic.country)
      AND UPPER(p.vendor)          = UPPER(dic.vendor)
      AND UPPER(dic.cost_group)    = 'DUTIES';

DROP TABLE IF EXISTS int.calc_tariff;

CREATE TABLE int.calc_tariff AS
SELECT
    p.tech_sku_id,
    CASE tic.incoterm
        WHEN 'FOB' THEN 
            CASE 
                WHEN td.duty_percentage IS NULL THEN NULL
                WHEN (td.duty_percentage - 0.0047) > ptf.value THEN 0
                ELSE ROUND(((ptf.value - (td.duty_percentage - 0.0047)) * p.fob)::numeric, 4)
            END

        WHEN 'EXW' THEN 
            CASE 
                WHEN td.duty_percentage IS NULL THEN NULL
                WHEN (td.duty_percentage - 0.0047) > ptf.value THEN 0
                ELSE ROUND(((ptf.value - (td.duty_percentage - 0.0047)) * p.exw)::numeric, 4)
            END

        WHEN 'DDP' THEN 
            CASE 
                WHEN td.duty_percentage IS NULL THEN NULL
                WHEN (td.duty_percentage - 0.0047) > ptf.value THEN 0
                ELSE ROUND(((ptf.value - (td.duty_percentage - 0.0047)) * p.ddp)::numeric, 4)
            END

        WHEN 'CNF' THEN 
            CASE 
                WHEN td.duty_percentage IS NULL THEN NULL
                WHEN (td.duty_percentage - 0.0047) > ptf.value THEN 0
                ELSE ROUND(((ptf.value - (td.duty_percentage - 0.0047)) * p.cnf)::numeric, 4)
            END

        WHEN 'CNF_DIFF' THEN 
            CASE 
                WHEN td.duty_percentage IS NULL THEN NULL
                WHEN (td.duty_percentage - 0.0047) > ptf.value THEN 0
                ELSE ROUND(((ptf.value - (td.duty_percentage - 0.0047)) * p.cnf_diff)::numeric, 4)
            END
    END AS tariff

FROM dev.product p
LEFT JOIN int.product_tariff_final ptf
  ON ptf.tech_sku_id = p.tech_sku_id
LEFT JOIN int.calc_duties td
  ON td.tech_sku_id = p.tech_sku_id
LEFT JOIN dev.incoterm_cost_group tic
  ON UPPER(p.origin_country) = UPPER(tic.country)
 AND UPPER(p.vendor)         = UPPER(tic.vendor)
 AND UPPER(tic.cost_group)   = 'TARIFF';


DROP TABLE IF EXISTS int.calc_carton_dims;
SELECT
    p.tech_sku_id,
    p.carton_length_mm / 25.4 AS carton_length_in,
    p.carton_height_mm / 25.4 AS carton_height_in,
    p.carton_width_mm  / 25.4 AS carton_width_in,
    p.carton_weight_kg * 2.204 AS carton_weight_lb,
    ((p.carton_height_mm / 1000) * (p.carton_length_mm / 1000) * (p.carton_width_mm / 1000)) + p.cbm_const AS case_cbm
INTO int.calc_carton_dims
FROM dev.product p;

DROP TABLE IF EXISTS int.common_cpap;
SELECT 
    LOWER(factory_mold) AS mold_key,
    case_pack,
    MIN(carton_per_american_pallet) AS carton_per_american_pallet
INTO int.common_cpap
FROM dev.product
WHERE factory_mold IS NOT NULL
  AND carton_per_american_pallet IS NOT NULL
  AND status = 'ACTIVE'
GROUP BY LOWER(factory_mold), case_pack;

DROP TABLE IF EXISTS int.calc_estimated_cpap;
SELECT 
    p.tech_sku_id,
    FLOOR(48.0 / bd.carton_length_in) * FLOOR(40.0 / bd.carton_width_in)  AS ti_op1,
    FLOOR(48.0 / bd.carton_width_in)  * FLOOR(40.0 / bd.carton_length_in) AS ti_op2,
    CASE 
        WHEN FLOOR(84.0 / bd.carton_height_in) * bd.carton_height_in > 84.0 
            THEN FLOOR(84.0 / bd.carton_height_in)
        ELSE CEIL(84.0 / bd.carton_height_in) 
    END AS hi
INTO int.calc_estimated_cpap
FROM dev.product p
LEFT JOIN int.calc_carton_dims bd
  ON bd.tech_sku_id = p.tech_sku_id;

DROP TABLE IF EXISTS int.estimated_optimal_cpap_dims_restriction;
SELECT
    p.tech_sku_id,
    CASE 
        WHEN (est.ti_op1 * est.hi) > (est.ti_op2 * est.hi)
            THEN est.ti_op1 * est.hi
        ELSE est.ti_op2 * est.hi
    END AS optimal_carton_per_pallet
INTO int.estimated_optimal_cpap_dims_restriction
FROM dev.product p
LEFT JOIN int.calc_estimated_cpap est
  ON est.tech_sku_id = p.tech_sku_id;

DROP TABLE IF EXISTS int.estimated_optimal_cpap;

CREATE TABLE int.estimated_optimal_cpap AS
SELECT 
    p.cn_code,
    p.tech_sku_id,
    CASE 
        WHEN (bd.carton_weight_lb * op.optimal_carton_per_pallet * 30) >= 29000 
            THEN ROUND(((29000.0 / bd.carton_weight_lb) / 30.0)::numeric, 0)
        ELSE op.optimal_carton_per_pallet
    END AS optimal_carton_per_pallet
FROM dev.product p
LEFT JOIN int.calc_carton_dims bd
  ON bd.tech_sku_id = p.tech_sku_id 
LEFT JOIN int.estimated_optimal_cpap_dims_restriction op
  ON op.tech_sku_id = p.tech_sku_id;


-- calc_40hc

DROP TABLE IF EXISTS int.calc_40hc;
SELECT
    p.tech_sku_id,
    bd.case_cbm,
    COALESCE(
        CASE 
            WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_40hc IS NOT NULL)
                THEN p.polybag_per_pallet * p.polybag_product_pallets_per_40hc
            ELSE p.confirmed_carton_per_40hc
        END,
        FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
    ) AS calculated_cartons_40hc_per_volume,
    COALESCE(
        CASE 
            WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_40hc IS NOT NULL)
                THEN p.polybag_per_pallet * p.polybag_product_pallets_per_40hc
            ELSE p.confirmed_carton_per_40hc
        END,
        FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
    ) * p.case_pack AS calculated_case_pack_40hc_per_volume,
    CASE
        WHEN FLOOR(mw.value / NULLIF(p.carton_weight_kg, 0)) <
             COALESCE(
                 CASE 
                     WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_40hc IS NOT NULL)
                         THEN p.polybag_per_pallet * p.polybag_product_pallets_per_40hc
                     ELSE p.confirmed_carton_per_40hc
                 END,
                 FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
             )
        THEN FLOOR(mw.value / NULLIF(p.carton_weight_kg, 0))
        ELSE COALESCE(
                 CASE 
                     WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_40hc IS NOT NULL)
                         THEN p.polybag_per_pallet * p.polybag_product_pallets_per_40hc
                     ELSE p.confirmed_carton_per_40hc
                 END,
                 FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
             )
    END AS optimal_cartons_per_40hc,
    CASE
        WHEN FLOOR(mw.value / NULLIF(p.carton_weight_kg, 0)) <
             COALESCE(
                  CASE 
                      WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_40hc IS NOT NULL)
                          THEN p.polybag_per_pallet * p.polybag_product_pallets_per_40hc
                      ELSE p.confirmed_carton_per_40hc
                  END,
                  FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
              )
        THEN FLOOR(mw.value / NULLIF(p.carton_weight_kg, 0)) * p.case_pack
        ELSE 
          CASE  WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_40hc IS NOT NULL) AND (p.pieces_per_polybag IS NOT NULL)
                THEN p.polybag_per_pallet * p.polybag_product_pallets_per_40hc * p.pieces_per_polybag
            ELSE
                COALESCE(
                    CASE 
                        WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_40hc IS NOT NULL)
                            THEN p.polybag_per_pallet * p.polybag_product_pallets_per_40hc
                        ELSE p.confirmed_carton_per_40hc
                    END,
                    FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
                ) * p.case_pack
        END
    END AS optimal_pieces_per_40hc
INTO int.calc_40hc
FROM dev.product p
CROSS JOIN int.maximum_weight_in_container mw
CROSS JOIN int.max_capacity_40hc_cbm cap
LEFT JOIN int.calc_carton_dims bd
  ON bd.tech_sku_id = p.tech_sku_id;

-- calc_45hc

DROP TABLE IF EXISTS int.calc_45hc;
SELECT
    p.tech_sku_id,
    bd.case_cbm,
    COALESCE(
        CASE 
            WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_45hc IS NOT NULL)
                THEN p.polybag_per_pallet * p.polybag_product_pallets_per_45hc
            ELSE p.confirmed_carton_per_45hc
        END,
        FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
    ) AS calculated_cartons_45hc_per_volume,
    COALESCE(
        CASE 
            WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_45hc IS NOT NULL)
                THEN p.polybag_per_pallet * p.polybag_product_pallets_per_45hc
            ELSE p.confirmed_carton_per_45hc
        END,
        FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
    ) * p.case_pack AS calculated_case_pack_45hc_per_volume,
    CASE
        WHEN FLOOR(mw.value / NULLIF(p.carton_weight_kg, 0)) <
             COALESCE(
                 CASE 
                     WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_45hc IS NOT NULL)
                         THEN p.polybag_per_pallet * p.polybag_product_pallets_per_45hc
                     ELSE p.confirmed_carton_per_45hc
                 END,
                 FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
             )
        THEN FLOOR(mw.value / NULLIF(p.carton_weight_kg, 0))
        ELSE COALESCE(
                 CASE 
                     WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_45hc IS NOT NULL)
                         THEN p.polybag_per_pallet * p.polybag_product_pallets_per_45hc
                     ELSE p.confirmed_carton_per_45hc
                 END,
                 FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
             )
    END AS optimal_cartons_per_45hc,
    CASE
        WHEN FLOOR(mw.value / NULLIF(p.carton_weight_kg, 0)) <
             COALESCE(
                  CASE 
                      WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_45hc IS NOT NULL)
                          THEN p.polybag_per_pallet * p.polybag_product_pallets_per_45hc
                      ELSE p.confirmed_carton_per_45hc
                  END,
                  FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
              )
        THEN FLOOR(mw.value / NULLIF(p.carton_weight_kg, 0)) * p.case_pack
        ELSE 
          CASE  WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_45hc IS NOT NULL) AND (p.pieces_per_polybag IS NOT NULL)
                THEN p.polybag_per_pallet * p.polybag_product_pallets_per_45hc * p.pieces_per_polybag
            ELSE
                COALESCE(
                    CASE 
                        WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_45hc IS NOT NULL)
                            THEN p.polybag_per_pallet * p.polybag_product_pallets_per_45hc
                        ELSE p.confirmed_carton_per_45hc
                    END,
                    FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
                ) * p.case_pack
        END
    END AS optimal_pieces_per_45hc
INTO int.calc_45hc
FROM dev.product p
CROSS JOIN int.maximum_weight_in_container mw
CROSS JOIN int.max_capacity_45hc_cbm cap
LEFT JOIN int.calc_carton_dims bd
  ON bd.tech_sku_id = p.tech_sku_id;

-- calc_40std

DROP TABLE IF EXISTS int.calc_40std;
SELECT
    p.tech_sku_id,
    bd.case_cbm,
    COALESCE(
        CASE 
            WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_40std IS NOT NULL)
                THEN p.polybag_per_pallet * p.polybag_product_pallets_per_40std
            ELSE p.confirmed_carton_per_40std
        END,
        FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
    ) AS calculated_cartons_40std_per_volume,
    COALESCE(
        CASE 
            WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_40std IS NOT NULL)
                THEN p.polybag_per_pallet * p.polybag_product_pallets_per_40std
            ELSE p.confirmed_carton_per_40std
        END,
        FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
    ) * p.case_pack AS calculated_case_pack_40std_per_volume,
    CASE
        WHEN FLOOR(mw.value / NULLIF(p.carton_weight_kg, 0)) <
             COALESCE(
                 CASE 
                     WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_40std IS NOT NULL)
                         THEN p.polybag_per_pallet * p.polybag_product_pallets_per_40std
                     ELSE p.confirmed_carton_per_40std
                 END,
                 FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
             )
        THEN FLOOR(mw.value / NULLIF(p.carton_weight_kg, 0))
        ELSE COALESCE(
                 CASE 
                     WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_40std IS NOT NULL)
                         THEN p.polybag_per_pallet * p.polybag_product_pallets_per_40std
                     ELSE p.confirmed_carton_per_40std
                 END,
                 FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
             )
    END AS optimal_cartons_per_40std,
    CASE
        WHEN FLOOR(mw.value / NULLIF(p.carton_weight_kg, 0)) <
             COALESCE(
                  CASE 
                      WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_40std IS NOT NULL)
                          THEN p.polybag_per_pallet * p.polybag_product_pallets_per_40std
                      ELSE p.confirmed_carton_per_40std
                  END,
                  FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
              )
        THEN FLOOR(mw.value / NULLIF(p.carton_weight_kg, 0)) * p.case_pack
        ELSE 
          CASE  WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_40std IS NOT NULL) AND (p.pieces_per_polybag IS NOT NULL)
                THEN p.polybag_per_pallet * p.polybag_product_pallets_per_40std * p.pieces_per_polybag
            ELSE
                COALESCE(
                    CASE 
                        WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_40std IS NOT NULL)
                            THEN p.polybag_per_pallet * p.polybag_product_pallets_per_40std
                        ELSE p.confirmed_carton_per_40std
                    END,
                    FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
                ) * p.case_pack
        END
    END AS optimal_pieces_per_40std
INTO int.calc_40std
FROM dev.product p
CROSS JOIN int.maximum_weight_in_container mw
CROSS JOIN int.max_capacity_40std_cbm cap
LEFT JOIN int.calc_carton_dims bd
  ON bd.tech_sku_id = p.tech_sku_id;

-- calc_20std

DROP TABLE IF EXISTS int.calc_20std;
SELECT
    p.tech_sku_id,
    bd.case_cbm,
    COALESCE(
        CASE 
            WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_20std IS NOT NULL)
                THEN p.polybag_per_pallet * p.polybag_product_pallets_per_20std
            ELSE p.confirmed_carton_per_20std
        END,
        FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
    ) AS calculated_cartons_20std_per_volume,
    COALESCE(
        CASE 
            WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_20std IS NOT NULL)
                THEN p.polybag_per_pallet * p.polybag_product_pallets_per_20std
            ELSE p.confirmed_carton_per_20std
        END,
        FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
    ) * p.case_pack AS calculated_case_pack_20std_per_volume,
    CASE
        WHEN FLOOR(mw.value / NULLIF(p.carton_weight_kg, 0)) <
             COALESCE(
                 CASE 
                     WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_20std IS NOT NULL)
                         THEN p.polybag_per_pallet * p.polybag_product_pallets_per_20std
                     ELSE p.confirmed_carton_per_20std
                 END,
                 FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
             )
        THEN FLOOR(mw.value / NULLIF(p.carton_weight_kg, 0))
        ELSE COALESCE(
                 CASE 
                     WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_20std IS NOT NULL)
                         THEN p.polybag_per_pallet * p.polybag_product_pallets_per_20std
                     ELSE p.confirmed_carton_per_20std
                 END,
                 FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
             )
    END AS optimal_cartons_per_20std,
    CASE
        WHEN FLOOR(mw.value / NULLIF(p.carton_weight_kg, 0)) <
             COALESCE(
                  CASE 
                      WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_20std IS NOT NULL)
                          THEN p.polybag_per_pallet * p.polybag_product_pallets_per_20std
                      ELSE p.confirmed_carton_per_20std
                  END,
                  FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
              )
        THEN FLOOR(mw.value / NULLIF(p.carton_weight_kg, 0)) * p.case_pack
        ELSE 
          CASE  WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_20std IS NOT NULL) AND (p.pieces_per_polybag IS NOT NULL)
                THEN p.polybag_per_pallet * p.polybag_product_pallets_per_20std * p.pieces_per_polybag
            ELSE
                COALESCE(
                    CASE 
                        WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_20std IS NOT NULL)
                            THEN p.polybag_per_pallet * p.polybag_product_pallets_per_20std
                        ELSE p.confirmed_carton_per_20std
                    END,
                    FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
                ) * p.case_pack
        END
    END AS optimal_pieces_per_20std
INTO int.calc_20std
FROM dev.product p
CROSS JOIN int.maximum_weight_in_container mw
CROSS JOIN int.max_capacity_20std_cbm cap
LEFT JOIN int.calc_carton_dims bd
  ON bd.tech_sku_id = p.tech_sku_id;

-- calc_53ft

DROP TABLE IF EXISTS int.calc_53ft;
SELECT
    p.tech_sku_id,
    bd.case_cbm,
    COALESCE(
        CASE 
            WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_53ft IS NOT NULL)
                THEN p.polybag_per_pallet * p.polybag_product_pallets_per_53ft
            ELSE p.confirmed_carton_per_53ft
        END,
        FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
    ) AS calculated_cartons_53ft_per_volume,
    COALESCE(
        CASE 
            WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_53ft IS NOT NULL)
                THEN p.polybag_per_pallet * p.polybag_product_pallets_per_53ft
            ELSE p.confirmed_carton_per_53ft
        END,
        FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
    ) * p.case_pack AS calculated_case_pack_53ft_per_volume,
    CASE
        WHEN FLOOR(mw.value / NULLIF(p.carton_weight_kg, 0)) <
             COALESCE(
                 CASE 
                     WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_53ft IS NOT NULL)
                         THEN p.polybag_per_pallet * p.polybag_product_pallets_per_53ft
                     ELSE p.confirmed_carton_per_53ft
                 END,
                 FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
             )
        THEN FLOOR(mw.value / NULLIF(p.carton_weight_kg, 0))
        ELSE COALESCE(
                 CASE 
                     WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_53ft IS NOT NULL)
                         THEN p.polybag_per_pallet * p.polybag_product_pallets_per_53ft
                     ELSE p.confirmed_carton_per_53ft
                 END,
                 FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
             )
    END AS optimal_cartons_per_53ft,
    CASE
        WHEN FLOOR(mw.value / NULLIF(p.carton_weight_kg, 0)) <
             COALESCE(
                  CASE 
                      WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_53ft IS NOT NULL)
                          THEN p.polybag_per_pallet * p.polybag_product_pallets_per_53ft
                      ELSE p.confirmed_carton_per_53ft
                  END,
                  FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
              )
        THEN FLOOR(mw.value / NULLIF(p.carton_weight_kg, 0)) * p.case_pack
        ELSE 
          CASE  WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_53ft IS NOT NULL) AND (p.pieces_per_polybag IS NOT NULL)
                THEN p.polybag_per_pallet * p.polybag_product_pallets_per_53ft * p.pieces_per_polybag
            ELSE
                COALESCE(
                    CASE 
                        WHEN (p.polybag_per_pallet IS NOT NULL) AND (p.polybag_product_pallets_per_53ft IS NOT NULL)
                            THEN p.polybag_per_pallet * p.polybag_product_pallets_per_53ft
                        ELSE p.confirmed_carton_per_53ft
                    END,
                    FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
                ) * p.case_pack
        END
    END AS optimal_pieces_per_53ft
INTO int.calc_53ft
FROM dev.product p
CROSS JOIN int.maximum_weight_in_container mw
CROSS JOIN int.max_capacity_53ft_cbm cap
LEFT JOIN int.calc_carton_dims bd
  ON bd.tech_sku_id = p.tech_sku_id;

-- vigent_ground_freights_parameters

DROP TABLE IF EXISTS int.vigent_ground_freights_parameters;
SELECT 
  UPPER(vendor) AS vendor,
  UPPER(factory_name)  AS factory_name,
  UPPER(origin_country) AS origin_country,
  UPPER(container_type) AS container_type,
  UPPER(destination_country) AS destination_country,
  UPPER(destination_warehouse) AS destination_warehouse,
  SUM(value)  AS total_log_cost
INTO int.vigent_ground_freights_parameters
FROM dev.ground_freights_parameters
WHERE start_date <= CURRENT_DATE
  AND end_date   > CURRENT_DATE
GROUP BY UPPER(vendor), UPPER(factory_name), UPPER(origin_country),
         UPPER(container_type), UPPER(destination_country), UPPER(destination_warehouse);

-- ground logistic cost per container type

DROP TABLE IF EXISTS int.ground_logistic_cost40hc;

CREATE TABLE int.ground_logistic_cost40hc AS
SELECT 
  p.tech_sku_id,
  CASE 
    WHEN gf.total_log_cost IS NULL THEN NULL
    ELSE ROUND((gf.total_log_cost / NULLIF(c40.optimal_pieces_per_40hc, 0))::numeric, 3)
  END AS ground_logistic_cost40hc
FROM dev.product p
LEFT JOIN int.vigent_ground_freights_parameters gf
  ON gf.vendor = p.vendor
  AND gf.factory_name = p.factory_name
  AND gf.origin_country = p.origin_country
  AND gf.container_type = '40HC'
  AND gf.destination_country = 'UNITED STATES'
  AND gf.destination_warehouse = 'CONNECTAR 11722NY'
LEFT JOIN int.calc_40hc c40 
  ON c40.tech_sku_id = p.tech_sku_id;


DROP TABLE IF EXISTS int.ground_logistic_cost45hc;

CREATE TABLE int.ground_logistic_cost45hc AS
SELECT 
  p.tech_sku_id,
  CASE 
    WHEN gf.total_log_cost IS NULL THEN NULL
    ELSE ROUND((gf.total_log_cost / NULLIF(c40.optimal_pieces_per_45hc, 0))::numeric, 3)
  END AS ground_logistic_cost45hc
FROM dev.product p
LEFT JOIN int.vigent_ground_freights_parameters gf
  ON gf.vendor = p.vendor
  AND gf.factory_name = p.factory_name
  AND gf.origin_country = p.origin_country
  AND gf.container_type = '45HC'
  AND gf.destination_country = 'UNITED STATES'
  AND gf.destination_warehouse = 'CONNECTAR 11722NY'
LEFT JOIN int.calc_45hc c40 
  ON c40.tech_sku_id = p.tech_sku_id;


DROP TABLE IF EXISTS int.ground_logistic_cost40std;

CREATE TABLE int.ground_logistic_cost40std AS
SELECT 
  p.tech_sku_id,
  CASE 
    WHEN gf.total_log_cost IS NULL THEN NULL
    ELSE ROUND((gf.total_log_cost / NULLIF(c40.optimal_pieces_per_40std, 0))::numeric, 3)
  END AS ground_logistic_cost40std
FROM dev.product p
LEFT JOIN int.vigent_ground_freights_parameters gf
  ON gf.vendor = p.vendor
  AND gf.factory_name = p.factory_name
  AND gf.origin_country = p.origin_country
  AND gf.container_type = '40STD'
  AND gf.destination_country = 'UNITED STATES'
  AND gf.destination_warehouse = 'CONNECTAR 11722NY'
LEFT JOIN int.calc_40std c40 
  ON c40.tech_sku_id = p.tech_sku_id;



DROP TABLE IF EXISTS int.ground_logistic_cost20std;

CREATE TABLE int.ground_logistic_cost20std AS
SELECT 
  p.tech_sku_id,
  CASE 
    WHEN gf.total_log_cost IS NULL THEN NULL
    ELSE ROUND((gf.total_log_cost / NULLIF(c40.optimal_pieces_per_20std, 0))::numeric, 3)
  END AS ground_logistic_cost20std
FROM dev.product p
LEFT JOIN int.vigent_ground_freights_parameters gf
  ON gf.vendor = p.vendor
  AND gf.factory_name = p.factory_name
  AND gf.origin_country = p.origin_country
  AND gf.container_type = '20STD'
  AND gf.destination_country = 'UNITED STATES'
  AND gf.destination_warehouse = 'CONNECTAR 11722NY'
LEFT JOIN int.calc_20std c40 
  ON c40.tech_sku_id = p.tech_sku_id;



DROP TABLE IF EXISTS int.ground_logistic_cost53ft;

CREATE TABLE int.ground_logistic_cost53ft AS
SELECT 
  p.tech_sku_id,
  CASE 
    WHEN gf.total_log_cost IS NULL THEN NULL
    ELSE ROUND((gf.total_log_cost / NULLIF(c40.optimal_pieces_per_53ft, 0))::numeric, 3)
  END AS ground_logistic_cost53ft
FROM dev.product p
LEFT JOIN int.vigent_ground_freights_parameters gf
  ON gf.vendor = p.vendor
  AND gf.factory_name = p.factory_name
  AND gf.origin_country = p.origin_country
  AND gf.container_type = '53FT'
  AND gf.destination_country = 'UNITED STATES'
  AND gf.destination_warehouse = 'CONNECTAR 11722NY'
LEFT JOIN int.calc_53ft c40 
  ON c40.tech_sku_id = p.tech_sku_id;


-- ocean logistic costs 40HC

DROP TABLE IF EXISTS int.ocean_logistic_cost40hc;

CREATE TABLE int.ocean_logistic_cost40hc AS
SELECT
    p.tech_sku_id,
    CASE lic.incoterm
        WHEN 'FOB' THEN
            ROUND(((rpc.value + eic.value + ppc.value + ofp.value + di.value)
                  / NULLIF(c40.optimal_pieces_per_40hc, 0))::numeric, 3)

        WHEN 'EXW' THEN
            ROUND(((rpc.value + eic.value + ppc.value + ofp.value + di.value + oi.value)
                  / NULLIF(c40.optimal_pieces_per_40hc, 0))::numeric, 3)

        WHEN 'DDP' THEN
            ROUND(((rpc.value + eic.value + ppc.value)
                  / NULLIF(c40.optimal_pieces_per_40hc, 0))::numeric, 3)

        WHEN 'CNF' THEN
            ROUND(((rpc.value + eic.value + ppc.value + di.value)
                  / NULLIF(c40.optimal_pieces_per_40hc, 0))::numeric, 3)

        WHEN 'CNF_DIFF' THEN
            ROUND(((rpc.value + eic.value + ppc.value + di.value + oi.value)
                  / NULLIF(c40.optimal_pieces_per_40hc, 0))::numeric, 3)
    END AS ocean_logistic_cost40hc
FROM dev.product p
CROSS JOIN int.realese_port_cost          rpc
CROSS JOIN int.exams_insuarance_port_cost eic
CROSS JOIN int.pallets_port_cost          ppc
LEFT JOIN int.calc_40hc  c40  
    ON c40.tech_sku_id = p.tech_sku_id
LEFT JOIN dev.incoterm_cost_group lic  
    ON UPPER(p.origin_country) = UPPER(lic.country)
    AND UPPER(p.vendor)        = UPPER(lic.vendor)
    AND UPPER(lic.cost_group)  = 'LOGISTIC'
LEFT JOIN int.vendor_main_port op  
    ON op.country = UPPER(p.origin_country)
    AND op.vendor  = UPPER(p.vendor)
LEFT JOIN int.vendor_main_port dp  
    ON dp.country = 'UNITED STATES'
    AND dp.vendor  = 'CONNECTAR'
LEFT JOIN dev.ocean_freights_parameters ofp
    ON ofp.origin_country       = p.origin_country
    AND ofp.destination_country = 'UNITED STATES'
    AND ofp.origin_port         = op.port
    AND ofp.destination_port    = dp.port
    AND ofp.container_type      = '40HC'
    AND ofp.start_date <= CURRENT_DATE
    AND ofp.end_date   > CURRENT_DATE
LEFT JOIN dev.inland_parameters oi  
    ON oi.country     = p.origin_country
    AND oi.inland_type = 'ORIGIN'
    AND oi.port        = op.port
    AND oi.start_date <= CURRENT_DATE
    AND oi.end_date   > CURRENT_DATE
LEFT JOIN dev.inland_parameters di  
    ON di.country     = 'UNITED STATES'
    AND di.inland_type = 'DESTINATION'
    AND di.port        = dp.port
    AND di.start_date <= CURRENT_DATE
    AND di.end_date   > CURRENT_DATE;


-- ocean_logistic_cost45hc

DROP TABLE IF EXISTS int.ocean_logistic_cost45hc;

CREATE TABLE int.ocean_logistic_cost45hc AS
SELECT
    p.tech_sku_id,
    CASE lic.incoterm
        WHEN 'FOB' THEN
            ROUND(((rpc.value + eic.value + ppc.value + ofp.value + di.value)
                  / NULLIF(c45.optimal_pieces_per_45hc, 0))::numeric, 3)

        WHEN 'EXW' THEN
            ROUND(((rpc.value + eic.value + ppc.value + ofp.value + di.value + oi.value)
                  / NULLIF(c45.optimal_pieces_per_45hc, 0))::numeric, 3)

        WHEN 'DDP' THEN
            ROUND(((rpc.value + eic.value + ppc.value)
                  / NULLIF(c45.optimal_pieces_per_45hc, 0))::numeric, 3)

        WHEN 'CNF' THEN
            ROUND(((rpc.value + eic.value + ppc.value + di.value)
                  / NULLIF(c45.optimal_pieces_per_45hc, 0))::numeric, 3)

        WHEN 'CNF_DIFF' THEN
            ROUND(((rpc.value + eic.value + ppc.value + di.value + oi.value)
                  / NULLIF(c45.optimal_pieces_per_45hc, 0))::numeric, 3)
    END AS ocean_logistic_cost45hc
FROM dev.product p
CROSS JOIN int.realese_port_cost          rpc
CROSS JOIN int.exams_insuarance_port_cost eic
CROSS JOIN int.pallets_port_cost          ppc
LEFT JOIN int.calc_45hc c45  
    ON c45.tech_sku_id = p.tech_sku_id
LEFT JOIN dev.incoterm_cost_group lic  
    ON UPPER(p.origin_country) = UPPER(lic.country)
    AND UPPER(p.vendor)        = UPPER(lic.vendor)
    AND UPPER(lic.cost_group)  = 'LOGISTIC'
LEFT JOIN int.vendor_main_port op  
    ON op.country = UPPER(p.origin_country)
    AND op.vendor  = UPPER(p.vendor)
LEFT JOIN int.vendor_main_port dp  
    ON dp.country = 'UNITED STATES'
    AND dp.vendor  = 'CONNECTAR'
LEFT JOIN dev.ocean_freights_parameters ofp
    ON ofp.origin_country       = p.origin_country
    AND ofp.destination_country = 'UNITED STATES'
    AND ofp.origin_port         = op.port
    AND ofp.destination_port    = dp.port
    AND ofp.container_type      = '45HC'
    AND ofp.start_date <= CURRENT_DATE
    AND ofp.end_date   > CURRENT_DATE
LEFT JOIN dev.inland_parameters oi  
    ON oi.country     = p.origin_country
    AND oi.inland_type = 'ORIGIN'
    AND oi.port        = op.port
    AND oi.start_date <= CURRENT_DATE
    AND oi.end_date   > CURRENT_DATE
LEFT JOIN dev.inland_parameters di  
    ON di.country     = 'UNITED STATES'
    AND di.inland_type = 'DESTINATION'
    AND di.port        = dp.port
    AND di.start_date <= CURRENT_DATE
    AND di.end_date   > CURRENT_DATE;

-- ocean_logistic_cost40std

DROP TABLE IF EXISTS int.ocean_logistic_cost40std;

CREATE TABLE int.ocean_logistic_cost40std AS
SELECT
    p.tech_sku_id,
    CASE lic.incoterm
        WHEN 'FOB' THEN
            ROUND(((rpc.value + eic.value + ppc.value + ofp.value + di.value)
                  / NULLIF(c40std.optimal_pieces_per_40std, 0))::numeric, 3)

        WHEN 'EXW' THEN
            ROUND(((rpc.value + eic.value + ppc.value + ofp.value + di.value + oi.value)
                  / NULLIF(c40std.optimal_pieces_per_40std, 0))::numeric, 3)

        WHEN 'DDP' THEN
            ROUND(((rpc.value + eic.value + ppc.value)
                  / NULLIF(c40std.optimal_pieces_per_40std, 0))::numeric, 3)

        WHEN 'CNF' THEN
            ROUND(((rpc.value + eic.value + ppc.value + di.value)
                  / NULLIF(c40std.optimal_pieces_per_40std, 0))::numeric, 3)

        WHEN 'CNF_DIFF' THEN
            ROUND(((rpc.value + eic.value + ppc.value + di.value + oi.value)
                  / NULLIF(c40std.optimal_pieces_per_40std, 0))::numeric, 3)
    END AS ocean_logistic_cost40std
FROM dev.product p
CROSS JOIN int.realese_port_cost rpc
CROSS JOIN int.exams_insuarance_port_cost eic
CROSS JOIN int.pallets_port_cost ppc
LEFT JOIN int.calc_40std c40std
  ON c40std.tech_sku_id = p.tech_sku_id
LEFT JOIN dev.incoterm_cost_group lic
  ON UPPER(p.origin_country) = UPPER(lic.country)
 AND UPPER(p.vendor)         = UPPER(lic.vendor)
 AND UPPER(lic.cost_group)   = 'LOGISTIC'
LEFT JOIN int.vendor_main_port op
  ON op.country = UPPER(p.origin_country)
 AND op.vendor  = UPPER(p.vendor)
LEFT JOIN int.vendor_main_port dp
  ON dp.country = 'UNITED STATES'
 AND dp.vendor  = 'CONNECTAR'
LEFT JOIN dev.ocean_freights_parameters ofp
  ON ofp.origin_country       = p.origin_country
 AND ofp.destination_country  = 'UNITED STATES'
 AND ofp.origin_port          = op.port
 AND ofp.destination_port     = dp.port
 AND ofp.container_type       = '40STD'
 AND ofp.start_date <= CURRENT_DATE
 AND ofp.end_date   > CURRENT_DATE
LEFT JOIN dev.inland_parameters oi
  ON oi.country = p.origin_country
 AND oi.inland_type = 'ORIGIN'
 AND oi.port = op.port
 AND oi.start_date <= CURRENT_DATE
 AND oi.end_date   > CURRENT_DATE
LEFT JOIN dev.inland_parameters di
  ON di.country = 'UNITED STATES'
 AND di.inland_type = 'DESTINATION'
 AND di.port = dp.port
 AND di.start_date <= CURRENT_DATE
 AND di.end_date   > CURRENT_DATE;


-- ocean_logistic_cost20std

DROP TABLE IF EXISTS int.ocean_logistic_cost20std;

CREATE TABLE int.ocean_logistic_cost20std AS
SELECT
    p.tech_sku_id,
    CASE lic.incoterm
        WHEN 'FOB' THEN
            ROUND(((rpc.value + eic.value + ppc.value + ofp.value + di.value)
                  / NULLIF(c20std.optimal_pieces_per_20std, 0))::numeric, 3)

        WHEN 'EXW' THEN
            ROUND(((rpc.value + eic.value + ppc.value + ofp.value + di.value + oi.value)
                  / NULLIF(c20std.optimal_pieces_per_20std, 0))::numeric, 3)

        WHEN 'DDP' THEN
            ROUND(((rpc.value + eic.value + ppc.value)
                  / NULLIF(c20std.optimal_pieces_per_20std, 0))::numeric, 3)

        WHEN 'CNF' THEN
            ROUND(((rpc.value + eic.value + ppc.value + di.value)
                  / NULLIF(c20std.optimal_pieces_per_20std, 0))::numeric, 3)

        WHEN 'CNF_DIFF' THEN
            ROUND(((rpc.value + eic.value + ppc.value + di.value + oi.value)
                  / NULLIF(c20std.optimal_pieces_per_20std, 0))::numeric, 3)
    END AS ocean_logistic_cost20std
FROM dev.product p
CROSS JOIN int.realese_port_cost rpc
CROSS JOIN int.exams_insuarance_port_cost eic
CROSS JOIN int.pallets_port_cost ppc
LEFT JOIN int.calc_20std c20std
  ON c20std.tech_sku_id = p.tech_sku_id
LEFT JOIN dev.incoterm_cost_group lic
  ON UPPER(p.origin_country) = UPPER(lic.country)
 AND UPPER(p.vendor)         = UPPER(lic.vendor)
 AND UPPER(lic.cost_group)   = 'LOGISTIC'
LEFT JOIN int.vendor_main_port op
  ON op.country = UPPER(p.origin_country)
 AND op.vendor  = UPPER(p.vendor)
LEFT JOIN int.vendor_main_port dp
  ON dp.country = 'UNITED STATES'
 AND dp.vendor  = 'CONNECTAR'
LEFT JOIN dev.ocean_freights_parameters ofp
  ON ofp.origin_country      = p.origin_country
 AND ofp.destination_country = 'UNITED STATES'
 AND ofp.origin_port         = op.port
 AND ofp.destination_port    = dp.port
 AND ofp.container_type      = '20STD'
 AND ofp.start_date <= CURRENT_DATE
 AND ofp.end_date   > CURRENT_DATE
LEFT JOIN dev.inland_parameters oi
  ON oi.country = p.origin_country
 AND oi.inland_type = 'ORIGIN'
 AND oi.port = op.port
 AND oi.start_date <= CURRENT_DATE
 AND oi.end_date   > CURRENT_DATE
LEFT JOIN dev.inland_parameters di
  ON di.country = 'UNITED STATES'
 AND di.inland_type = 'DESTINATION'
 AND di.port = dp.port
 AND di.start_date <= CURRENT_DATE
 AND di.end_date   > CURRENT_DATE;

-- ocean_logistic_cost53ft

DROP TABLE IF EXISTS int.ocean_logistic_cost53ft;

CREATE TABLE int.ocean_logistic_cost53ft AS
SELECT
    p.tech_sku_id,
    CASE lic.incoterm
        WHEN 'FOB' THEN
            ROUND(((rpc.value + eic.value + ppc.value + ofp.value + di.value)
                  / NULLIF(c53ft.optimal_pieces_per_53ft, 0))::numeric, 3)

        WHEN 'EXW' THEN
            ROUND(((rpc.value + eic.value + ppc.value + ofp.value + di.value + oi.value)
                  / NULLIF(c53ft.optimal_pieces_per_53ft, 0))::numeric, 3)

        WHEN 'DDP' THEN
            ROUND(((rpc.value + eic.value + ppc.value)
                  / NULLIF(c53ft.optimal_pieces_per_53ft, 0))::numeric, 3)

        WHEN 'CNF' THEN
            ROUND(((rpc.value + eic.value + ppc.value + di.value)
                  / NULLIF(c53ft.optimal_pieces_per_53ft, 0))::numeric, 3)

        WHEN 'CNF_DIFF' THEN
            ROUND(((rpc.value + eic.value + ppc.value + di.value + oi.value)
                  / NULLIF(c53ft.optimal_pieces_per_53ft, 0))::numeric, 3)
    END AS ocean_logistic_cost53ft
FROM dev.product p
CROSS JOIN int.realese_port_cost rpc
CROSS JOIN int.exams_insuarance_port_cost eic
CROSS JOIN int.pallets_port_cost ppc
LEFT JOIN int.calc_53ft c53ft
  ON c53ft.tech_sku_id = p.tech_sku_id
LEFT JOIN dev.incoterm_cost_group lic
  ON UPPER(p.origin_country) = UPPER(lic.country)
 AND UPPER(p.vendor)         = UPPER(lic.vendor)
 AND UPPER(lic.cost_group)   = 'LOGISTIC'
LEFT JOIN int.vendor_main_port op
  ON op.country = UPPER(p.origin_country)
 AND op.vendor  = UPPER(p.vendor)
LEFT JOIN int.vendor_main_port dp
  ON dp.country = 'UNITED STATES'
 AND dp.vendor  = 'CONNECTAR'
LEFT JOIN dev.ocean_freights_parameters ofp
  ON ofp.origin_country       = p.origin_country
 AND ofp.destination_country  = 'UNITED STATES'
 AND ofp.origin_port          = op.port
 AND ofp.destination_port     = dp.port
 AND ofp.container_type       = '53FT'
 AND ofp.start_date <= CURRENT_DATE
 AND ofp.end_date   > CURRENT_DATE
LEFT JOIN dev.inland_parameters oi
  ON oi.country = p.origin_country
 AND oi.inland_type = 'ORIGIN'
 AND oi.port = op.port
 AND oi.start_date <= CURRENT_DATE
 AND oi.end_date   > CURRENT_DATE
LEFT JOIN dev.inland_parameters di
  ON di.country = 'UNITED STATES'
 AND di.inland_type = 'DESTINATION'
 AND di.port = dp.port
 AND di.start_date <= CURRENT_DATE
 AND di.end_date   > CURRENT_DATE;


-- final logistic cost

DROP TABLE IF EXISTS int.logistic_cost_40hc;
SELECT 
  p.tech_sku_id,
  COALESCE(g.ground_logistic_cost40hc, o.ocean_logistic_cost40hc) AS logistic_cost_40hc
INTO int.logistic_cost_40hc
FROM dev.product p
LEFT JOIN int.ground_logistic_cost40hc g
  ON g.tech_sku_id = p.tech_sku_id
LEFT JOIN int.ocean_logistic_cost40hc o
  ON o.tech_sku_id = p.tech_sku_id;

DROP TABLE IF EXISTS int.logistic_cost_45hc;
SELECT 
  p.tech_sku_id,
  COALESCE(g.ground_logistic_cost45hc, o.ocean_logistic_cost45hc) AS logistic_cost_45hc
INTO int.logistic_cost_45hc
FROM dev.product p
LEFT JOIN int.ground_logistic_cost45hc g
  ON g.tech_sku_id = p.tech_sku_id
LEFT JOIN int.ocean_logistic_cost45hc o
  ON o.tech_sku_id = p.tech_sku_id;

DROP TABLE IF EXISTS int.logistic_cost_40std;
SELECT 
  p.tech_sku_id,
  COALESCE(g.ground_logistic_cost40std, o.ocean_logistic_cost40std) AS logistic_cost_40std
INTO int.logistic_cost_40std
FROM dev.product p
LEFT JOIN int.ground_logistic_cost40std g
  ON g.tech_sku_id = p.tech_sku_id
LEFT JOIN int.ocean_logistic_cost40std o
  ON o.tech_sku_id = p.tech_sku_id;

DROP TABLE IF EXISTS int.logistic_cost_20std;
SELECT 
  p.tech_sku_id,
  COALESCE(g.ground_logistic_cost20std, o.ocean_logistic_cost20std) AS logistic_cost_20std
INTO int.logistic_cost_20std
FROM dev.product p
LEFT JOIN int.ground_logistic_cost20std g
  ON g.tech_sku_id = p.tech_sku_id
LEFT JOIN int.ocean_logistic_cost20std o
  ON o.tech_sku_id = p.tech_sku_id;

DROP TABLE IF EXISTS int.logistic_cost_53ft;
SELECT 
  p.tech_sku_id,
  COALESCE(g.ground_logistic_cost53ft, o.ocean_logistic_cost53ft) AS logistic_cost_53ft
INTO int.logistic_cost_53ft
FROM dev.product p
LEFT JOIN int.ground_logistic_cost53ft g
  ON g.tech_sku_id = p.tech_sku_id
LEFT JOIN int.ocean_logistic_cost53ft o
  ON o.tech_sku_id = p.tech_sku_id;

-- landed cost 40hc

DROP TABLE IF EXISTS int.landed_cost_40hc;

CREATE TABLE int.landed_cost_40hc AS
SELECT
  p.tech_sku_id,
  CASE logistic_incoterm.incoterm

    WHEN 'FOB' THEN
      ROUND((
          COALESCE(td.duty_cost, 0)::numeric
        + COALESCE(tarf.tariff, 0)::numeric
        + COALESCE(p.fob, 0)::numeric
        + COALESCE(log_40hc.logistic_cost_40hc, 0)::numeric
      ), 3)

    WHEN 'EXW' THEN
      ROUND((
          COALESCE(td.duty_cost, 0)::numeric
        + COALESCE(tarf.tariff, 0)::numeric
        + COALESCE(p.exw, 0)::numeric
        + COALESCE(log_40hc.logistic_cost_40hc, 0)::numeric
      ), 3)

    WHEN 'DDP' THEN
      ROUND((
          COALESCE(td.duty_cost, 0)::numeric
        + COALESCE(tarf.tariff, 0)::numeric
        + COALESCE(p.ddp, 0)::numeric
        + COALESCE(log_40hc.logistic_cost_40hc, 0)::numeric
      ), 3)

    WHEN 'CNF' THEN
      ROUND((
          COALESCE(td.duty_cost, 0)::numeric
        + COALESCE(tarf.tariff, 0)::numeric
        + COALESCE(p.cnf, 0)::numeric
        + COALESCE(log_40hc.logistic_cost_40hc, 0)::numeric
      ), 3)

    WHEN 'CNF_DIFF' THEN
      ROUND((
          COALESCE(td.duty_cost, 0)::numeric
        + COALESCE(tarf.tariff, 0)::numeric
        + COALESCE(p.cnf_diff, 0)::numeric
        + COALESCE(log_40hc.logistic_cost_40hc, 0)::numeric
      ), 3)

  END AS landed_cost_40hc

FROM dev.product p
LEFT JOIN int.calc_duties td
  ON td.tech_sku_id = p.tech_sku_id
LEFT JOIN int.calc_tariff tarf
  ON tarf.tech_sku_id = p.tech_sku_id
LEFT JOIN int.logistic_cost_40hc log_40hc
  ON log_40hc.tech_sku_id = p.tech_sku_id
LEFT JOIN dev.incoterm_cost_group logistic_incoterm
  ON UPPER(p.origin_country) = UPPER(logistic_incoterm.country)
 AND UPPER(p.vendor)         = UPPER(logistic_incoterm.vendor)
 AND UPPER(logistic_incoterm.cost_group) = 'LOGISTIC';

DROP TABLE IF EXISTS int.landed_cost_45hc;

CREATE TABLE int.landed_cost_45hc AS
SELECT
  p.tech_sku_id,
  CASE logistic_incoterm.incoterm

    WHEN 'FOB' THEN
      ROUND((
          COALESCE(td.duty_cost, 0)::numeric
        + COALESCE(tarf.tariff, 0)::numeric
        + COALESCE(p.fob, 0)::numeric
        + COALESCE(log_45hc.logistic_cost_45hc, 0)::numeric
      ), 3)

    WHEN 'EXW' THEN
      ROUND((
          COALESCE(td.duty_cost, 0)::numeric
        + COALESCE(tarf.tariff, 0)::numeric
        + COALESCE(p.exw, 0)::numeric
        + COALESCE(log_45hc.logistic_cost_45hc, 0)::numeric
      ), 3)

    WHEN 'DDP' THEN
      ROUND((
          COALESCE(td.duty_cost, 0)::numeric
        + COALESCE(tarf.tariff, 0)::numeric
        + COALESCE(p.ddp, 0)::numeric
        + COALESCE(log_45hc.logistic_cost_45hc, 0)::numeric
      ), 3)

    WHEN 'CNF' THEN
      ROUND((
          COALESCE(td.duty_cost, 0)::numeric
        + COALESCE(tarf.tariff, 0)::numeric
        + COALESCE(p.cnf, 0)::numeric
        + COALESCE(log_45hc.logistic_cost_45hc, 0)::numeric
      ), 3)

    WHEN 'CNF_DIFF' THEN
      ROUND((
          COALESCE(td.duty_cost, 0)::numeric
        + COALESCE(tarf.tariff, 0)::numeric
        + COALESCE(p.cnf_diff, 0)::numeric
        + COALESCE(log_45hc.logistic_cost_45hc, 0)::numeric
      ), 3)

  END AS landed_cost_45hc

FROM dev.product p
LEFT JOIN int.calc_duties td
  ON td.tech_sku_id = p.tech_sku_id
LEFT JOIN int.calc_tariff tarf
  ON tarf.tech_sku_id = p.tech_sku_id
LEFT JOIN int.logistic_cost_45hc log_45hc
  ON log_45hc.tech_sku_id = p.tech_sku_id
LEFT JOIN dev.incoterm_cost_group logistic_incoterm
  ON UPPER(p.origin_country) = UPPER(logistic_incoterm.country)
 AND UPPER(p.vendor)         = UPPER(logistic_incoterm.vendor)
 AND UPPER(logistic_incoterm.cost_group) = 'LOGISTIC';



DROP TABLE IF EXISTS int.landed_cost_40std;

CREATE TABLE int.landed_cost_40std AS
SELECT
  p.tech_sku_id,
  CASE logistic_incoterm.incoterm

    WHEN 'FOB' THEN
      ROUND((
          COALESCE(td.duty_cost, 0)::numeric
        + COALESCE(tarf.tariff, 0)::numeric
        + COALESCE(p.fob, 0)::numeric
        + COALESCE(log_40std.logistic_cost_40std, 0)::numeric
      ), 3)

    WHEN 'EXW' THEN
      ROUND((
          COALESCE(td.duty_cost, 0)::numeric
        + COALESCE(tarf.tariff, 0)::numeric
        + COALESCE(p.exw, 0)::numeric
        + COALESCE(log_40std.logistic_cost_40std, 0)::numeric
      ), 3)

    WHEN 'DDP' THEN
      ROUND((
          COALESCE(td.duty_cost, 0)::numeric
        + COALESCE(tarf.tariff, 0)::numeric
        + COALESCE(p.ddp, 0)::numeric
        + COALESCE(log_40std.logistic_cost_40std, 0)::numeric
      ), 3)

    WHEN 'CNF' THEN
      ROUND((
          COALESCE(td.duty_cost, 0)::numeric
        + COALESCE(tarf.tariff, 0)::numeric
        + COALESCE(p.cnf, 0)::numeric
        + COALESCE(log_40std.logistic_cost_40std, 0)::numeric
      ), 3)

    WHEN 'CNF_DIFF' THEN
      ROUND((
          COALESCE(td.duty_cost, 0)::numeric
        + COALESCE(tarf.tariff, 0)::numeric
        + COALESCE(p.cnf_diff, 0)::numeric
        + COALESCE(log_40std.logistic_cost_40std, 0)::numeric
      ), 3)

  END AS landed_cost_40std

FROM dev.product p
LEFT JOIN int.calc_duties td
  ON td.tech_sku_id = p.tech_sku_id
LEFT JOIN int.calc_tariff tarf
  ON tarf.tech_sku_id = p.tech_sku_id
LEFT JOIN int.logistic_cost_40std log_40std
  ON log_40std.tech_sku_id = p.tech_sku_id
LEFT JOIN dev.incoterm_cost_group logistic_incoterm
  ON UPPER(p.origin_country) = UPPER(logistic_incoterm.country)
 AND UPPER(p.vendor)         = UPPER(logistic_incoterm.vendor)
 AND UPPER(logistic_incoterm.cost_group) = 'LOGISTIC';



DROP TABLE IF EXISTS int.landed_cost_20std;

CREATE TABLE int.landed_cost_20std AS
SELECT
  p.tech_sku_id,
  CASE logistic_incoterm.incoterm

    WHEN 'FOB' THEN
      ROUND((
          COALESCE(td.duty_cost, 0)::numeric
        + COALESCE(tarf.tariff, 0)::numeric
        + COALESCE(p.fob, 0)::numeric
        + COALESCE(log_20std.logistic_cost_20std, 0)::numeric
      ), 3)

    WHEN 'EXW' THEN
      ROUND((
          COALESCE(td.duty_cost, 0)::numeric
        + COALESCE(tarf.tariff, 0)::numeric
        + COALESCE(p.exw, 0)::numeric
        + COALESCE(log_20std.logistic_cost_20std, 0)::numeric
      ), 3)

    WHEN 'DDP' THEN
      ROUND((
          COALESCE(td.duty_cost, 0)::numeric
        + COALESCE(tarf.tariff, 0)::numeric
        + COALESCE(p.ddp, 0)::numeric
        + COALESCE(log_20std.logistic_cost_20std, 0)::numeric
      ), 3)

    WHEN 'CNF' THEN
      ROUND((
          COALESCE(td.duty_cost, 0)::numeric
        + COALESCE(tarf.tariff, 0)::numeric
        + COALESCE(p.cnf, 0)::numeric
        + COALESCE(log_20std.logistic_cost_20std, 0)::numeric
      ), 3)

    WHEN 'CNF_DIFF' THEN
      ROUND((
          COALESCE(td.duty_cost, 0)::numeric
        + COALESCE(tarf.tariff, 0)::numeric
        + COALESCE(p.cnf_diff, 0)::numeric
        + COALESCE(log_20std.logistic_cost_20std, 0)::numeric
      ), 3)

  END AS landed_cost_20std

FROM dev.product p
LEFT JOIN int.calc_duties td
  ON td.tech_sku_id = p.tech_sku_id
LEFT JOIN int.calc_tariff tarf
  ON tarf.tech_sku_id = p.tech_sku_id
LEFT JOIN int.logistic_cost_20std log_20std
  ON log_20std.tech_sku_id = p.tech_sku_id
LEFT JOIN dev.incoterm_cost_group logistic_incoterm
  ON UPPER(p.origin_country) = UPPER(logistic_incoterm.country)
 AND UPPER(p.vendor)         = UPPER(logistic_incoterm.vendor)
 AND UPPER(logistic_incoterm.cost_group) = 'LOGISTIC';


DROP TABLE IF EXISTS int.landed_cost_53ft;

CREATE TABLE int.landed_cost_53ft AS
SELECT
  p.tech_sku_id,
  CASE logistic_incoterm.incoterm

    WHEN 'FOB' THEN
      ROUND((
          COALESCE(td.duty_cost, 0)::numeric
        + COALESCE(tarf.tariff, 0)::numeric
        + COALESCE(p.fob, 0)::numeric
        + COALESCE(log_53ft.logistic_cost_53ft, 0)::numeric
      ), 3)

    WHEN 'EXW' THEN
      ROUND((
          COALESCE(td.duty_cost, 0)::numeric
        + COALESCE(tarf.tariff, 0)::numeric
        + COALESCE(p.exw, 0)::numeric
        + COALESCE(log_53ft.logistic_cost_53ft, 0)::numeric
      ), 3)

    WHEN 'DDP' THEN
      ROUND((
          COALESCE(td.duty_cost, 0)::numeric
        + COALESCE(tarf.tariff, 0)::numeric
        + COALESCE(p.ddp, 0)::numeric
        + COALESCE(log_53ft.logistic_cost_53ft, 0)::numeric
      ), 3)

    WHEN 'CNF' THEN
      ROUND((
          COALESCE(td.duty_cost, 0)::numeric
        + COALESCE(tarf.tariff, 0)::numeric
        + COALESCE(p.cnf, 0)::numeric
        + COALESCE(log_53ft.logistic_cost_53ft, 0)::numeric
      ), 3)

    WHEN 'CNF_DIFF' THEN
      ROUND((
          COALESCE(td.duty_cost, 0)::numeric
        + COALESCE(tarf.tariff, 0)::numeric
        + COALESCE(p.cnf_diff, 0)::numeric
        + COALESCE(log_53ft.logistic_cost_53ft, 0)::numeric
      ), 3)

  END AS landed_cost_53ft

FROM dev.product p
LEFT JOIN int.calc_duties td
  ON td.tech_sku_id = p.tech_sku_id
LEFT JOIN int.calc_tariff tarf
  ON tarf.tech_sku_id = p.tech_sku_id
LEFT JOIN int.logistic_cost_53ft log_53ft
  ON log_53ft.tech_sku_id = p.tech_sku_id
LEFT JOIN dev.incoterm_cost_group logistic_incoterm
  ON UPPER(p.origin_country) = UPPER(logistic_incoterm.country)
 AND UPPER(p.vendor)         = UPPER(logistic_incoterm.vendor)
 AND UPPER(logistic_incoterm.cost_group) = 'LOGISTIC';



-- kits

DROP TABLE IF EXISTS int.kit_part_non_sellable_costs;
SELECT tech_sku_id, ddp AS cost
INTO int.kit_part_non_sellable_costs
FROM dev.product
WHERE product_or_kit = 'PRODUCT_KIT_NON_SELLABLE';

DROP TABLE IF EXISTS int.kit_part_cost_per_container;
SELECT
    pk.tech_sku_id_kit,
    pk.tech_sku_id_part,
    CASE 
      WHEN part.product_or_kit = 'PRODUCT_KIT_SELLABLE'     THEN lc40hc.landed_cost_40hc
      WHEN part.product_or_kit = 'PRODUCT_KIT_NON_SELLABLE' THEN kpc.cost
    END AS cost_40hc,
    CASE 
      WHEN part.product_or_kit = 'PRODUCT_KIT_SELLABLE'     THEN lc45hc.landed_cost_45hc
      WHEN part.product_or_kit = 'PRODUCT_KIT_NON_SELLABLE' THEN kpc.cost
    END AS cost_45hc,
    CASE 
      WHEN part.product_or_kit = 'PRODUCT_KIT_SELLABLE'     THEN lc40std.landed_cost_40std
      WHEN part.product_or_kit = 'PRODUCT_KIT_NON_SELLABLE' THEN kpc.cost
    END AS cost_40std,
    CASE 
      WHEN part.product_or_kit = 'PRODUCT_KIT_SELLABLE'     THEN lc20std.landed_cost_20std
      WHEN part.product_or_kit = 'PRODUCT_KIT_NON_SELLABLE' THEN kpc.cost
    END AS cost_20std,
    CASE 
      WHEN part.product_or_kit = 'PRODUCT_KIT_SELLABLE'     THEN lc53ft.landed_cost_53ft
      WHEN part.product_or_kit = 'PRODUCT_KIT_NON_SELLABLE' THEN kpc.cost
    END AS cost_53ft
INTO int.kit_part_cost_per_container
FROM dev.product_kits pk
INNER JOIN dev.product part
        ON part.tech_sku_id = pk.tech_sku_id_part
LEFT JOIN int.kit_part_non_sellable_costs kpc
       ON kpc.tech_sku_id = part.tech_sku_id
      AND part.product_or_kit = 'PRODUCT_KIT_NON_SELLABLE'
LEFT JOIN int.landed_cost_40hc  lc40hc  ON lc40hc.tech_sku_id  = part.tech_sku_id
LEFT JOIN int.landed_cost_45hc  lc45hc  ON lc45hc.tech_sku_id  = part.tech_sku_id
LEFT JOIN int.landed_cost_40std lc40std ON lc40std.tech_sku_id = part.tech_sku_id
LEFT JOIN int.landed_cost_20std lc20std ON lc20std.tech_sku_id = part.tech_sku_id
LEFT JOIN int.landed_cost_53ft  lc53ft  ON lc53ft.tech_sku_id  = part.tech_sku_id;

DROP TABLE IF EXISTS int.kit_landed_cost;
SELECT 
    tech_sku_id_kit,
    CASE WHEN COUNT(*) = COUNT(cost_40hc)  THEN SUM(cost_40hc)  ELSE NULL END AS kit_cost_40hc,
    CASE WHEN COUNT(*) = COUNT(cost_45hc)  THEN SUM(cost_45hc)  ELSE NULL END AS kit_cost_45hc,
    CASE WHEN COUNT(*) = COUNT(cost_40std) THEN SUM(cost_40std) ELSE NULL END AS kit_cost_40std,
    CASE WHEN COUNT(*) = COUNT(cost_20std) THEN SUM(cost_20std) ELSE NULL END AS kit_cost_20std,
    CASE WHEN COUNT(*) = COUNT(cost_53ft)  THEN SUM(cost_53ft)  ELSE NULL END AS kit_cost_53ft
INTO int.kit_landed_cost
FROM int.kit_part_cost_per_container
GROUP BY tech_sku_id_kit;

-- commission

DROP TABLE IF EXISTS int.product_commission;

CREATE TABLE int.product_commission AS
SELECT
 p.tech_sku_id,
 CASE UPPER(icg.incoterm)

   WHEN 'FOB' THEN 
     CASE 
       WHEN p.commission_percentage IS NULL OR p.fob IS NULL THEN NULL
       ELSE ROUND((p.commission_percentage * p.fob)::numeric, 4)
     END

   WHEN 'EXW' THEN 
     CASE 
       WHEN p.commission_percentage IS NULL OR p.exw IS NULL THEN NULL
       ELSE ROUND((p.commission_percentage * p.exw)::numeric, 4)
     END

   WHEN 'DDP' THEN 
     CASE 
       WHEN p.commission_percentage IS NULL OR p.ddp IS NULL THEN NULL
       ELSE ROUND((p.commission_percentage * p.ddp)::numeric, 4)
     END

   WHEN 'CNF' THEN 
     CASE 
       WHEN p.commission_percentage IS NULL OR p.cnf IS NULL THEN NULL
       ELSE ROUND((p.commission_percentage * p.cnf)::numeric, 4)
     END

   WHEN 'CNF_DIFF' THEN 
     CASE 
       WHEN p.commission_percentage IS NULL OR p.cnf_diff IS NULL THEN NULL
       ELSE ROUND((p.commission_percentage * p.cnf_diff)::numeric, 4)
     END

   ELSE NULL
 END AS commission_amount

FROM dev.product p
LEFT JOIN dev.incoterm_cost_group icg
  ON UPPER(p.origin_country) = UPPER(icg.country)
 AND UPPER(p.vendor)         = UPPER(icg.vendor)
 AND UPPER(icg.cost_group)   = 'COMMISSION';

