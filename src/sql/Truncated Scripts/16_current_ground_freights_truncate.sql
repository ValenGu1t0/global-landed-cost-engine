  TRUNCATE int.vigent_ground_freights_parameters;

  INSERT INTO int.vigent_ground_freights_parameters (
      vendor,
      factory_name,
      origin_country,
      container_type,
      destination_country,
      destination_warehouse,
      total_log_cost
  )
  SELECT 
    UPPER(vendor) AS vendor,
    UPPER(factory_name) AS factory_name,
    UPPER(origin_country) AS origin_country,
    UPPER(container_type) AS container_type,
    UPPER(destination_country) AS destination_country,
    UPPER(destination_warehouse) AS destination_warehouse,
    SUM(value) AS total_log_cost
  FROM public.ground_freights_parameters
  WHERE start_date::date <= CURRENT_DATE
    AND end_date::date   > CURRENT_DATE
  GROUP BY 
    UPPER(vendor),
    UPPER(factory_name),
    UPPER(origin_country),
    UPPER(container_type),
    UPPER(destination_country),
    UPPER(destination_warehouse);
