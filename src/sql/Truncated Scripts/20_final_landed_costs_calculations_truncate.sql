CREATE TABLE IF NOT EXISTS int.landed_cost_40hc (
    tech_sku_id bigint PRIMARY KEY,
    landed_cost_40hc numeric
);

TRUNCATE int.landed_cost_40hc;

INSERT INTO int.landed_cost_40hc (tech_sku_id, landed_cost_40hc)
SELECT
  p.tech_sku_id,
  CASE logistic_incoterm.incoterm
    WHEN 'FOB' THEN ROUND((COALESCE(td.duty_cost,0)+COALESCE(tarf.tariff,0)+COALESCE(p.fob,0)+COALESCE(log_40hc.logistic_cost_40hc,0))::numeric,3)
    WHEN 'EXW' THEN ROUND((COALESCE(td.duty_cost,0)+COALESCE(tarf.tariff,0)+COALESCE(p.exw,0)+COALESCE(log_40hc.logistic_cost_40hc,0))::numeric,3)
    WHEN 'DDP' THEN ROUND((COALESCE(td.duty_cost,0)+COALESCE(tarf.tariff,0)+COALESCE(p.ddp,0)+COALESCE(log_40hc.logistic_cost_40hc,0))::numeric,3)
    WHEN 'CNF' THEN ROUND((COALESCE(td.duty_cost,0)+COALESCE(tarf.tariff,0)+COALESCE(p.cnf,0)+COALESCE(log_40hc.logistic_cost_40hc,0))::numeric,3)
    WHEN 'CNF_DIFF' THEN ROUND((COALESCE(td.duty_cost,0)+COALESCE(tarf.tariff,0)+COALESCE(p.cnf_diff,0)+COALESCE(log_40hc.logistic_cost_40hc,0))::numeric,3)
  END
FROM public.product p
LEFT JOIN int.calc_duties td ON td.tech_sku_id = p.tech_sku_id
LEFT JOIN int.calc_tariff tarf ON tarf.tech_sku_id = p.tech_sku_id
LEFT JOIN int.logistic_cost_40hc log_40hc ON log_40hc.tech_sku_id = p.tech_sku_id
LEFT JOIN public.incoterm_cost_group logistic_incoterm
  ON UPPER(p.origin_country)=UPPER(logistic_incoterm.country)
 AND UPPER(p.vendor)=UPPER(logistic_incoterm.vendor)
 AND UPPER(logistic_incoterm.cost_group)='LOGISTIC';


CREATE TABLE IF NOT EXISTS int.landed_cost_45hc (
    tech_sku_id bigint PRIMARY KEY,
    landed_cost_45hc numeric
);

TRUNCATE int.landed_cost_45hc;

INSERT INTO int.landed_cost_45hc (tech_sku_id, landed_cost_45hc)
SELECT
  p.tech_sku_id,
  CASE logistic_incoterm.incoterm
    WHEN 'FOB' THEN ROUND((COALESCE(td.duty_cost,0)+COALESCE(tarf.tariff,0)+COALESCE(p.fob,0)+COALESCE(log_45hc.logistic_cost_45hc,0))::numeric,3)
    WHEN 'EXW' THEN ROUND((COALESCE(td.duty_cost,0)+COALESCE(tarf.tariff,0)+COALESCE(p.exw,0)+COALESCE(log_45hc.logistic_cost_45hc,0))::numeric,3)
    WHEN 'DDP' THEN ROUND((COALESCE(td.duty_cost,0)+COALESCE(tarf.tariff,0)+COALESCE(p.ddp,0)+COALESCE(log_45hc.logistic_cost_45hc,0))::numeric,3)
    WHEN 'CNF' THEN ROUND((COALESCE(td.duty_cost,0)+COALESCE(tarf.tariff,0)+COALESCE(p.cnf,0)+COALESCE(log_45hc.logistic_cost_45hc,0))::numeric,3)
    WHEN 'CNF_DIFF' THEN ROUND((COALESCE(td.duty_cost,0)+COALESCE(tarf.tariff,0)+COALESCE(p.cnf_diff,0)+COALESCE(log_45hc.logistic_cost_45hc,0))::numeric,3)
  END
FROM public.product p
LEFT JOIN int.calc_duties td ON td.tech_sku_id = p.tech_sku_id
LEFT JOIN int.calc_tariff tarf ON tarf.tech_sku_id = p.tech_sku_id
LEFT JOIN int.logistic_cost_45hc log_45hc ON log_45hc.tech_sku_id = p.tech_sku_id
LEFT JOIN public.incoterm_cost_group logistic_incoterm
  ON UPPER(p.origin_country)=UPPER(logistic_incoterm.country)
 AND UPPER(p.vendor)=UPPER(logistic_incoterm.vendor)
 AND UPPER(logistic_incoterm.cost_group)='LOGISTIC';

CREATE TABLE IF NOT EXISTS int.landed_cost_40std (
    tech_sku_id bigint PRIMARY KEY,
    landed_cost_40std numeric
);

TRUNCATE int.landed_cost_40std;

INSERT INTO int.landed_cost_40std (tech_sku_id, landed_cost_40std)
SELECT
  p.tech_sku_id,
  CASE logistic_incoterm.incoterm
    WHEN 'FOB' THEN ROUND((COALESCE(td.duty_cost,0)+COALESCE(tarf.tariff,0)+COALESCE(p.fob,0)+COALESCE(log_40std.logistic_cost_40std,0))::numeric,3)
    WHEN 'EXW' THEN ROUND((COALESCE(td.duty_cost,0)+COALESCE(tarf.tariff,0)+COALESCE(p.exw,0)+COALESCE(log_40std.logistic_cost_40std,0))::numeric,3)
    WHEN 'DDP' THEN ROUND((COALESCE(td.duty_cost,0)+COALESCE(tarf.tariff,0)+COALESCE(p.ddp,0)+COALESCE(log_40std.logistic_cost_40std,0))::numeric,3)
    WHEN 'CNF' THEN ROUND((COALESCE(td.duty_cost,0)+COALESCE(tarf.tariff,0)+COALESCE(p.cnf,0)+COALESCE(log_40std.logistic_cost_40std,0))::numeric,3)
    WHEN 'CNF_DIFF' THEN ROUND((COALESCE(td.duty_cost,0)+COALESCE(tarf.tariff,0)+COALESCE(p.cnf_diff,0)+COALESCE(log_40std.logistic_cost_40std,0))::numeric,3)
  END
FROM public.product p
LEFT JOIN int.calc_duties td ON td.tech_sku_id = p.tech_sku_id
LEFT JOIN int.calc_tariff tarf ON tarf.tech_sku_id = p.tech_sku_id
LEFT JOIN int.logistic_cost_40std log_40std ON log_40std.tech_sku_id = p.tech_sku_id
LEFT JOIN public.incoterm_cost_group logistic_incoterm
  ON UPPER(p.origin_country)=UPPER(logistic_incoterm.country)
 AND UPPER(p.vendor)=UPPER(logistic_incoterm.vendor)
 AND UPPER(logistic_incoterm.cost_group)='LOGISTIC';

CREATE TABLE IF NOT EXISTS int.landed_cost_20std (
    tech_sku_id bigint PRIMARY KEY,
    landed_cost_20std numeric
);

TRUNCATE int.landed_cost_20std;

INSERT INTO int.landed_cost_20std (tech_sku_id, landed_cost_20std)
SELECT
  p.tech_sku_id,
  CASE logistic_incoterm.incoterm
    WHEN 'FOB' THEN ROUND((COALESCE(td.duty_cost,0)+COALESCE(tarf.tariff,0)+COALESCE(p.fob,0)+COALESCE(log_20std.logistic_cost_20std,0))::numeric,3)
    WHEN 'EXW' THEN ROUND((COALESCE(td.duty_cost,0)+COALESCE(tarf.tariff,0)+COALESCE(p.exw,0)+COALESCE(log_20std.logistic_cost_20std,0))::numeric,3)
    WHEN 'DDP' THEN ROUND((COALESCE(td.duty_cost,0)+COALESCE(tarf.tariff,0)+COALESCE(p.ddp,0)+COALESCE(log_20std.logistic_cost_20std,0))::numeric,3)
    WHEN 'CNF' THEN ROUND((COALESCE(td.duty_cost,0)+COALESCE(tarf.tariff,0)+COALESCE(p.cnf,0)+COALESCE(log_20std.logistic_cost_20std,0))::numeric,3)
    WHEN 'CNF_DIFF' THEN ROUND((COALESCE(td.duty_cost,0)+COALESCE(tarf.tariff,0)+COALESCE(p.cnf_diff,0)+COALESCE(log_20std.logistic_cost_20std,0))::numeric,3)
  END
FROM public.product p
LEFT JOIN int.calc_duties td ON td.tech_sku_id = p.tech_sku_id
LEFT JOIN int.calc_tariff tarf ON tarf.tech_sku_id = p.tech_sku_id
LEFT JOIN int.logistic_cost_20std log_20std ON log_20std.tech_sku_id = p.tech_sku_id
LEFT JOIN public.incoterm_cost_group logistic_incoterm
  ON UPPER(p.origin_country)=UPPER(logistic_incoterm.country)
 AND UPPER(p.vendor)=UPPER(logistic_incoterm.vendor)
 AND UPPER(logistic_incoterm.cost_group)='LOGISTIC';

CREATE TABLE IF NOT EXISTS int.landed_cost_53ft (
    tech_sku_id bigint PRIMARY KEY,
    landed_cost_53ft numeric
);

TRUNCATE int.landed_cost_53ft;

INSERT INTO int.landed_cost_53ft (tech_sku_id, landed_cost_53ft)
SELECT
  p.tech_sku_id,
  CASE logistic_incoterm.incoterm
    WHEN 'FOB' THEN ROUND((COALESCE(td.duty_cost,0)+COALESCE(tarf.tariff,0)+COALESCE(p.fob,0)+COALESCE(log_53ft.logistic_cost_53ft,0))::numeric,3)
    WHEN 'EXW' THEN ROUND((COALESCE(td.duty_cost,0)+COALESCE(tarf.tariff,0)+COALESCE(p.exw,0)+COALESCE(log_53ft.logistic_cost_53ft,0))::numeric,3)
    WHEN 'DDP' THEN ROUND((COALESCE(td.duty_cost,0)+COALESCE(tarf.tariff,0)+COALESCE(p.ddp,0)+COALESCE(log_53ft.logistic_cost_53ft,0))::numeric,3)
    WHEN 'CNF' THEN ROUND((COALESCE(td.duty_cost,0)+COALESCE(tarf.tariff,0)+COALESCE(p.cnf,0)+COALESCE(log_53ft.logistic_cost_53ft,0))::numeric,3)
    WHEN 'CNF_DIFF' THEN ROUND((COALESCE(td.duty_cost,0)+COALESCE(tarf.tariff,0)+COALESCE(p.cnf_diff,0)+COALESCE(log_53ft.logistic_cost_53ft,0))::numeric,3)
  END
FROM public.product p
LEFT JOIN int.calc_duties td ON td.tech_sku_id = p.tech_sku_id
LEFT JOIN int.calc_tariff tarf ON tarf.tech_sku_id = p.tech_sku_id
LEFT JOIN int.logistic_cost_53ft log_53ft ON log_53ft.tech_sku_id = p.tech_sku_id
LEFT JOIN public.incoterm_cost_group logistic_incoterm
  ON UPPER(p.origin_country)=UPPER(logistic_incoterm.country)
 AND UPPER(p.vendor)=UPPER(logistic_incoterm.vendor)
 AND UPPER(logistic_incoterm.cost_group)='LOGISTIC';
