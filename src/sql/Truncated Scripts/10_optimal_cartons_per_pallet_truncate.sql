TRUNCATE int.common_cpap;

INSERT INTO int.common_cpap (mold_key, case_pack, carton_per_american_pallet)
SELECT 
    LOWER(factory_mold) AS mold_key,
    case_pack,
    MIN(carton_per_american_pallet)
FROM public.product
WHERE factory_mold IS NOT NULL
  AND carton_per_american_pallet IS NOT NULL
  AND status = 'ACTIVE'
GROUP BY LOWER(factory_mold), case_pack;

TRUNCATE int.calc_estimated_cpap;

INSERT INTO int.calc_estimated_cpap (tech_sku_id, ti_op1, ti_op2, hi)
SELECT
    p.tech_sku_id,

    /* TI Option 1 */
    FLOOR(48.0 / NULLIF(bd.carton_length_in, 0)) 
        * FLOOR(40.0 / NULLIF(bd.carton_width_in, 0))  AS ti_op1,

    /* TI Option 2 */
    FLOOR(48.0 / NULLIF(bd.carton_width_in, 0))  
        * FLOOR(40.0 / NULLIF(bd.carton_length_in, 0)) AS ti_op2,

    /* HI calculation */
    CASE
        WHEN FLOOR(84.0 / NULLIF(bd.carton_height_in, 0)) * bd.carton_height_in > 84.0
            THEN FLOOR(84.0 / NULLIF(bd.carton_height_in, 0))
        ELSE CEIL(84.0 / NULLIF(bd.carton_height_in, 0))
    END AS hi

FROM public.product p
LEFT JOIN int.calc_carton_dims bd
  ON bd.tech_sku_id = p.tech_sku_id;


TRUNCATE int.estimated_optimal_cpap_dims_restriction;

INSERT INTO int.estimated_optimal_cpap_dims_restriction (tech_sku_id, optimal_carton_per_pallet)
SELECT
    p.tech_sku_id,
    CASE 
        WHEN (est.ti_op1 * est.hi) > (est.ti_op2 * est.hi)
            THEN est.ti_op1 * est.hi
        ELSE est.ti_op2 * est.hi
    END AS optimal_carton_per_pallet
FROM public.product p
LEFT JOIN int.calc_estimated_cpap est
  ON est.tech_sku_id = p.tech_sku_id;

TRUNCATE int.estimated_optimal_cpap;

INSERT INTO int.estimated_optimal_cpap (hemicode, tech_sku_id, optimal_carton_per_pallet)
SELECT 
    p.hemicode,
    p.tech_sku_id,
    CASE 
        WHEN (bd.carton_weight_lb * op.optimal_carton_per_pallet * 30) >= 29000 
            THEN ROUND(((29000.0 / bd.carton_weight_lb) / 30.0)::numeric, 0)
        ELSE op.optimal_carton_per_pallet
    END AS optimal_carton_per_pallet
FROM public.product p
LEFT JOIN int.calc_carton_dims bd
  ON bd.tech_sku_id = p.tech_sku_id 
LEFT JOIN int.estimated_optimal_cpap_dims_restriction op
  ON op.tech_sku_id = p.tech_sku_id;
