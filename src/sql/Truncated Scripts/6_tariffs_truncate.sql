TRUNCATE int.vigent_tariff_parameters;

INSERT INTO int.vigent_tariff_parameters
SELECT
  UPPER(origin_country),
  UPPER(destination_country),
  start_date,
  end_date,
  value / 100,
  duty_dependent
FROM public.tariff_parameters
WHERE start_date::date <= CURRENT_DATE
  AND CURRENT_DATE < end_date::date;

TRUNCATE int.vigent_tariff_max_start_date;

INSERT INTO int.vigent_tariff_max_start_date
SELECT
  origin_country,
  destination_country,
  MAX(start_date)
FROM int.vigent_tariff_parameters
GROUP BY origin_country, destination_country;

TRUNCATE int.vigent_tariff_latest_start_date;

INSERT INTO int.vigent_tariff_latest_start_date
SELECT
  vt.origin_country,
  vt.destination_country,
  vt.start_date,
  vt.end_date,
  vt.value,
  vt.duty_dependent
FROM int.vigent_tariff_parameters vt
JOIN int.vigent_tariff_max_start_date ms
  ON vt.origin_country      = ms.origin_country
 AND vt.destination_country = ms.destination_country
 AND vt.start_date          = ms.max_start_date;

TRUNCATE int.vigent_tariff_max_end_date;

INSERT INTO int.vigent_tariff_max_end_date
SELECT
  origin_country,
  destination_country,
  MAX(end_date)
FROM int.vigent_tariff_latest_start_date
GROUP BY origin_country, destination_country;

TRUNCATE int.current_country_tariff;

INSERT INTO int.current_country_tariff
SELECT
  ls.origin_country,
  ls.destination_country,
  ls.value,
  ls.duty_dependent
FROM int.vigent_tariff_latest_start_date ls
JOIN int.vigent_tariff_max_end_date me
  ON ls.origin_country      = me.origin_country
 AND ls.destination_country = me.destination_country
 And ls.end_date            = me.max_end_date;

TRUNCATE int.vigent_tariff_hts_exceptions;

INSERT INTO int.vigent_tariff_hts_exceptions
SELECT
    hts_code,
    UPPER(origin_country),
    UPPER(destination_country),
    special_tariff_value / 100,
    start_date,
    end_date
FROM public.tariff_hts_exceptions
WHERE cost_group = 'tariff'
  AND CURRENT_DATE >= start_date::date
  AND CURRENT_DATE <  end_date::date;

TRUNCATE int.product_special_tariff_candidates;

INSERT INTO int.product_special_tariff_candidates
SELECT
    p.tech_sku_id,
    e.value,
    ROW_NUMBER() OVER (
        PARTITION BY p.tech_sku_id
        ORDER BY e.start_date DESC, e.end_date DESC
    ) AS row_number
FROM public.product p
INNER JOIN int.product_hts ph
  ON ph.tech_sku_id = p.tech_sku_id
INNER JOIN int.vigent_tariff_hts_exceptions e
  ON e.hts_code = ph.hts_code
 AND e.origin_country      = UPPER(p.origin_country)
 AND e.destination_country = 'UNITED STATES';

TRUNCATE int.product_special_tariff;

INSERT INTO int.product_special_tariff
SELECT tech_sku_id, value
FROM int.product_special_tariff_candidates
WHERE row_number = 1;

TRUNCATE int.product_tariff_final;

INSERT INTO int.product_tariff_final
SELECT
    p.tech_sku_id,
    COALESCE(pst.value, ct.value)
FROM public.product p
LEFT JOIN int.product_special_tariff pst
  ON pst.tech_sku_id = p.tech_sku_id
LEFT JOIN int.current_country_tariff ct
  ON ct.origin_country      = UPPER(p.origin_country)
 AND ct.destination_country = 'UNITED STATES';
