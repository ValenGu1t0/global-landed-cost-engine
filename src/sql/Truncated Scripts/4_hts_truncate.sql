TRUNCATE int.hts_fixed;

INSERT INTO int.hts_fixed
SELECT *
FROM public.hts_codes
WHERE LOWER(type) = 'fixed';


TRUNCATE int.hts_cost;

INSERT INTO int.hts_cost
SELECT *
FROM public.hts_codes
WHERE LOWER(type) = 'cost';

TRUNCATE int.hts_volume;

INSERT INTO int.hts_volume
SELECT *
FROM public.hts_codes
WHERE LOWER(type) = 'volume';

TRUNCATE int.product_hts_candidates;

INSERT INTO int.product_hts_candidates (
    tech_sku_id,
    hts_code,
    hts_duty,
    hts_type,
    hts_product_subtype,
    fixed_duty_per_piece,
    row_number
)
SELECT 
  p.tech_sku_id,    
  COALESCE(hsf.hts_code, hcs.hts_code, hvs.hts_code) AS hts_code,
  COALESCE(hsf.duty,     hcs.duty,     hvs.duty)     AS hts_duty,
  COALESCE(hsf.type,     hcs.type,     hvs.type)     AS hts_type,
  COALESCE(hsf.hts_product_subtype, hcs.hts_product_subtype, hvs.hts_product_subtype)
      AS hts_product_subtype,
  COALESCE(hsf.fixed_duty_per_piece, hcs.fixed_duty_per_piece, hvs.fixed_duty_per_piece)
      AS fixed_duty_per_piece,
  ROW_NUMBER() OVER (
      PARTITION BY p.tech_sku_id
      ORDER BY  CASE 
          WHEN hsf.hts_code IS NOT NULL THEN 1
          WHEN hcs.hts_code IS NOT NULL THEN 2
          WHEN hvs.hts_code IS NOT NULL THEN 3
          ELSE 4
      END
  ) AS row_number
FROM public.product p
LEFT JOIN int.hts_fixed hsf 
    ON hsf.hts_category = p.hts_category
    AND hsf.hts_product_subtype = p.hts_product_subtype
LEFT JOIN int.hts_cost hcs 
    ON hcs.hts_category = p.hts_category
    AND hcs.hts_product_subtype = p.hts_product_subtype
    AND p.fob IS NOT NULL
    AND (p.fob > hcs.min_value AND p.fob <= hcs.max_value)
LEFT JOIN int.hts_volume hvs 
    ON hvs.hts_category = p.hts_category
    AND hvs.hts_product_subtype = p.hts_product_subtype
    AND p.product_volume_ml IS NOT NULL
    AND (p.product_volume_ml > hvs.min_value AND p.product_volume_ml <= hvs.max_value);

TRUNCATE int.product_hts;

INSERT INTO int.product_hts (
    tech_sku_id,
    hts_code,
    hts_duty,
    hts_type,
    hts_product_subtype,
    fixed_duty_per_piece
)
SELECT
    tech_sku_id,
    hts_code,
    hts_duty,
    hts_type,
    hts_product_subtype,
    fixed_duty_per_piece
FROM int.product_hts_candidates
WHERE row_number = 1;
