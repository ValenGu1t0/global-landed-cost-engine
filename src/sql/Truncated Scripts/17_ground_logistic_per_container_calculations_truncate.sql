TRUNCATE int.ground_logistic_cost40hc;

INSERT INTO int.ground_logistic_cost40hc (tech_sku_id, ground_logistic_cost40hc)
SELECT 
  p.tech_sku_id,
  CASE 
    WHEN gf.total_log_cost IS NULL THEN NULL
    ELSE ROUND((gf.total_log_cost / NULLIF(c40.optimal_pieces_per_40hc, 0))::numeric, 3)
  END
FROM public.product p
LEFT JOIN int.vigent_ground_freights_parameters gf
  ON gf.vendor = p.vendor
 AND gf.factory_name = p.factory_name
 AND gf.origin_country = p.origin_country
 AND gf.container_type = '40HC'
 AND gf.destination_country = 'UNITED STATES'
 AND gf.destination_warehouse = 'CONNECTAR 11722NY'
LEFT JOIN int.calc_40hc c40 
  ON c40.tech_sku_id = p.tech_sku_id;

TRUNCATE int.ground_logistic_cost45hc;

INSERT INTO int.ground_logistic_cost45hc (tech_sku_id, ground_logistic_cost45hc)
SELECT 
  p.tech_sku_id,
  CASE 
    WHEN gf.total_log_cost IS NULL THEN NULL
    ELSE ROUND((gf.total_log_cost / NULLIF(c40.optimal_pieces_per_45hc, 0))::numeric, 3)
  END
FROM public.product p
LEFT JOIN int.vigent_ground_freights_parameters gf
  ON gf.vendor = p.vendor
 AND gf.factory_name = p.factory_name
 AND gf.origin_country = p.origin_country
 AND gf.container_type = '45HC'
 AND gf.destination_country = 'UNITED STATES'
 AND gf.destination_warehouse = 'CONNECTAR 11722NY'
LEFT JOIN int.calc_45hc c40 
  ON c40.tech_sku_id = p.tech_sku_id;

TRUNCATE int.ground_logistic_cost40std;

INSERT INTO int.ground_logistic_cost40std (tech_sku_id, ground_logistic_cost40std)
SELECT 
  p.tech_sku_id,
  CASE 
    WHEN gf.total_log_cost IS NULL THEN NULL
    ELSE ROUND((gf.total_log_cost / NULLIF(c40.optimal_pieces_per_40std, 0))::numeric, 3)
  END
FROM public.product p
LEFT JOIN int.vigent_ground_freights_parameters gf
  ON gf.vendor = p.vendor
 AND gf.factory_name = p.factory_name
 AND gf.origin_country = p.origin_country
 AND gf.container_type = '40STD'
 AND gf.destination_country = 'UNITED STATES'
 AND gf.destination_warehouse = 'CONNECTAR 11722NY'
LEFT JOIN int.calc_40std c40 
  ON c40.tech_sku_id = p.tech_sku_id;

TRUNCATE int.ground_logistic_cost20std;

INSERT INTO int.ground_logistic_cost20std (tech_sku_id, ground_logistic_cost20std)
SELECT 
  p.tech_sku_id,
  CASE 
    WHEN gf.total_log_cost IS NULL THEN NULL
    ELSE ROUND((gf.total_log_cost / NULLIF(c40.optimal_pieces_per_20std, 0))::numeric, 3)
  END
FROM public.product p
LEFT JOIN int.vigent_ground_freights_parameters gf
  ON gf.vendor = p.vendor
 AND gf.factory_name = p.factory_name
 AND gf.origin_country = p.origin_country
 AND gf.container_type = '20STD'
 AND gf.destination_country = 'UNITED STATES'
 AND gf.destination_warehouse = 'CONNECTAR 11722NY'
LEFT JOIN int.calc_20std c40 
  ON c40.tech_sku_id = p.tech_sku_id;

TRUNCATE int.ground_logistic_cost53ft;

INSERT INTO int.ground_logistic_cost53ft (tech_sku_id, ground_logistic_cost53ft)
SELECT 
  p.tech_sku_id,
  CASE 
    WHEN gf.total_log_cost IS NULL THEN NULL
    ELSE ROUND((gf.total_log_cost / NULLIF(c40.optimal_pieces_per_53ft, 0))::numeric, 3)
  END
FROM public.product p
LEFT JOIN int.vigent_ground_freights_parameters gf
  ON gf.vendor = p.vendor
 AND gf.factory_name = p.factory_name
 AND gf.origin_country = p.origin_country
 AND gf.container_type = '53FT'
 AND gf.destination_country = 'UNITED STATES'
 AND gf.destination_warehouse = 'CONNECTAR 11722NY'
LEFT JOIN int.calc_53ft c40 
  ON c40.tech_sku_id = p.tech_sku_id;
