TRUNCATE int.vendor_main_port;

INSERT INTO int.vendor_main_port (vendor, country, port)
SELECT
  UPPER(vendor)  AS vendor,
  UPPER(country) AS country,
  MIN(port)      AS port
FROM public.vendor_ports
WHERE main_port = TRUE
GROUP BY UPPER(vendor), UPPER(country);