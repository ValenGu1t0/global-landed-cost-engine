TRUNCATE int.vigent_commercial_agreemments;

INSERT INTO int.vigent_commercial_agreemments
SELECT
  UPPER(origin_country),
  UPPER(destination_country),
  UPPER(raw_material),
  start_date,
  end_date
FROM public.duties_commercial_agreements
WHERE start_date::date <= CURRENT_DATE
  AND CURRENT_DATE < end_date::date;

TRUNCATE int.country_pair_has_all;

INSERT INTO int.country_pair_has_all
SELECT
  origin_country,
  destination_country
FROM int.vigent_commercial_agreemments
WHERE raw_material = 'ALL'
GROUP BY origin_country, destination_country;

TRUNCATE int.all_agreements_max_start_date;

INSERT INTO int.all_agreements_max_start_date
SELECT
  v.origin_country,
  v.destination_country,
  MAX(v.start_date)
FROM int.vigent_commercial_agreemments v
INNER JOIN int.country_pair_has_all a
  ON v.origin_country = a.origin_country
 AND v.destination_country = a.destination_country
WHERE v.raw_material = 'ALL'
GROUP BY v.origin_country, v.destination_country;

TRUNCATE int.all_agreements_latest_start_date;

INSERT INTO int.all_agreements_latest_start_date
SELECT
  v.origin_country,
  v.destination_country,
  v.raw_material,
  v.start_date,
  v.end_date
FROM int.vigent_commercial_agreemments v
INNER JOIN int.all_agreements_max_start_date ms
  ON ms.origin_country      = v.origin_country
 AND ms.destination_country = v.destination_country
 AND ms.max_start_date      = v.start_date
WHERE v.raw_material = 'ALL';

TRUNCATE int.all_agreements_max_end_date;

INSERT INTO int.all_agreements_max_end_date
SELECT
  origin_country,
  destination_country,
  MAX(end_date)
FROM int.all_agreements_latest_start_date
GROUP BY origin_country, destination_country;

TRUNCATE int.current_all_agreements;

INSERT INTO int.current_all_agreements
SELECT
  a.origin_country,
  a.destination_country,
  'ALL'
FROM int.all_agreements_latest_start_date a
INNER JOIN int.all_agreements_max_end_date me
  ON me.origin_country      = a.origin_country
 AND me.destination_country = a.destination_country
 AND me.max_end_date        = a.end_date
GROUP BY a.origin_country, a.destination_country;

TRUNCATE int.country_pair_has_material;

INSERT INTO int.country_pair_has_material
SELECT
  v.origin_country,
  v.destination_country,
  v.raw_material,
  v.start_date,
  v.end_date
FROM int.vigent_commercial_agreemments v
LEFT JOIN int.country_pair_has_all a
  ON v.origin_country      = a.origin_country
 AND v.destination_country = a.destination_country
WHERE a.origin_country IS NULL;

TRUNCATE int.material_agreements_max_start_date;

INSERT INTO int.material_agreements_max_start_date
SELECT
  origin_country,
  destination_country,
  raw_material,
  MAX(start_date)
FROM int.country_pair_has_material
GROUP BY origin_country, destination_country, raw_material;

TRUNCATE int.material_agreements_latest_start_date;

INSERT INTO int.material_agreements_latest_start_date
SELECT
  m.origin_country,
  m.destination_country,
  m.raw_material,
  m.start_date,
  m.end_date
FROM int.country_pair_has_material m
INNER JOIN int.material_agreements_max_start_date ms
  ON ms.origin_country      = m.origin_country
 AND ms.destination_country = m.destination_country
 And ms.raw_material        = m.raw_material
 AND ms.max_start_date      = m.start_date;

TRUNCATE int.material_agreements_max_end_date;

INSERT INTO int.material_agreements_max_end_date
SELECT
  origin_country,
  destination_country,
  raw_material,
  MAX(end_date)
FROM int.material_agreements_latest_start_date
GROUP BY origin_country, destination_country, raw_material;

TRUNCATE int.current_material_agreements;

INSERT INTO int.current_material_agreements
SELECT
  m.origin_country,
  m.destination_country,
  m.raw_material
FROM int.material_agreements_latest_start_date m
INNER JOIN int.material_agreements_max_end_date me
  ON me.origin_country      = m.origin_country
 AND me.destination_country = m.destination_country
 AND me.raw_material        = m.raw_material
 AND me.max_end_date        = m.end_date;

TRUNCATE int.current_commercial_agreements;

INSERT INTO int.current_commercial_agreements
SELECT
  origin_country,
  destination_country,
  raw_material
FROM int.current_all_agreements

UNION ALL

SELECT
  origin_country,
  destination_country,
  raw_material
FROM int.current_material_agreements;
