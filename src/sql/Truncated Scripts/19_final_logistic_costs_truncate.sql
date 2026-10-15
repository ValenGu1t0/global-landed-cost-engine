CREATE TABLE IF NOT EXISTS int.logistic_cost_40hc (
    tech_sku_id bigint PRIMARY KEY,
    logistic_cost_40hc numeric
);

TRUNCATE int.logistic_cost_40hc;

INSERT INTO int.logistic_cost_40hc (tech_sku_id, logistic_cost_40hc)
SELECT 
  p.tech_sku_id,
  COALESCE(g.ground_logistic_cost40hc, o.ocean_logistic_cost40hc)
FROM public.product p
LEFT JOIN int.ground_logistic_cost40hc g
  ON g.tech_sku_id = p.tech_sku_id
LEFT JOIN int.ocean_logistic_cost40hc o
  ON o.tech_sku_id = p.tech_sku_id;

CREATE TABLE IF NOT EXISTS int.logistic_cost_45hc (
    tech_sku_id bigint PRIMARY KEY,
    logistic_cost_45hc numeric
);

TRUNCATE int.logistic_cost_45hc;

INSERT INTO int.logistic_cost_45hc (tech_sku_id, logistic_cost_45hc)
SELECT 
  p.tech_sku_id,
  COALESCE(g.ground_logistic_cost45hc, o.ocean_logistic_cost45hc)
FROM public.product p
LEFT JOIN int.ground_logistic_cost45hc g
  ON g.tech_sku_id = p.tech_sku_id
LEFT JOIN int.ocean_logistic_cost45hc o
  ON o.tech_sku_id = p.tech_sku_id;

CREATE TABLE IF NOT EXISTS int.logistic_cost_40std (
    tech_sku_id bigint PRIMARY KEY,
    logistic_cost_40std numeric
);

TRUNCATE int.logistic_cost_40std;

INSERT INTO int.logistic_cost_40std (tech_sku_id, logistic_cost_40std)
SELECT 
  p.tech_sku_id,
  COALESCE(g.ground_logistic_cost40std, o.ocean_logistic_cost40std)
FROM public.product p
LEFT JOIN int.ground_logistic_cost40std g
  ON g.tech_sku_id = p.tech_sku_id
LEFT JOIN int.ocean_logistic_cost40std o
  ON o.tech_sku_id = p.tech_sku_id;

CREATE TABLE IF NOT EXISTS int.logistic_cost_20std (
    tech_sku_id bigint PRIMARY KEY,
    logistic_cost_20std numeric
);

TRUNCATE int.logistic_cost_20std;

INSERT INTO int.logistic_cost_20std (tech_sku_id, logistic_cost_20std)
SELECT 
  p.tech_sku_id,
  COALESCE(g.ground_logistic_cost20std, o.ocean_logistic_cost20std)
FROM public.product p
LEFT JOIN int.ground_logistic_cost20std g
  ON g.tech_sku_id = p.tech_sku_id
LEFT JOIN int.ocean_logistic_cost20std o
  ON o.tech_sku_id = p.tech_sku_id;

CREATE TABLE IF NOT EXISTS int.logistic_cost_53ft (
    tech_sku_id bigint PRIMARY KEY,
    logistic_cost_53ft numeric
);

TRUNCATE int.logistic_cost_53ft;

INSERT INTO int.logistic_cost_53ft (tech_sku_id, logistic_cost_53ft)
SELECT 
  p.tech_sku_id,
  COALESCE(g.ground_logistic_cost53ft, o.ocean_logistic_cost53ft)
FROM public.product p
LEFT JOIN int.ground_logistic_cost53ft g
  ON g.tech_sku_id = p.tech_sku_id
LEFT JOIN int.ocean_logistic_cost53ft o
  ON o.tech_sku_id = p.tech_sku_id;
