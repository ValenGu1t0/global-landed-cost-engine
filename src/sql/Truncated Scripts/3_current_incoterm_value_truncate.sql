TRUNCATE int.vigent_product_cost_per_incoterm;

INSERT INTO int.vigent_product_cost_per_incoterm (
    tech_sku_id,
    import_incoterm,
    cost,
    start_date,
    end_date,
    cost_update_commentary,
    rn
)
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
FROM public.product_historic_costs phc
WHERE phc.start_date::date <= CURRENT_DATE
  AND (CURRENT_DATE < phc.end_date::date OR phc.end_date::date IS NULL);


TRUNCATE int.current_product_costs;

INSERT INTO int.current_product_costs (
    tech_sku_id,
    fob_current_cost_value,
    fob_current_cost_start_date,
    fob_current_cost_end_date,
    fob_current_cost_update_commentary,

    exw_current_cost_value,
    exw_current_cost_start_date,
    exw_current_cost_end_date,
    exw_current_cost_update_commentary,

    ddp_current_cost_value,
    ddp_current_cost_start_date,
    ddp_current_cost_end_date,
    ddp_current_cost_update_commentary,

    cnf_diff_current_cost_value,
    cnf_diff_current_cost_start_date,
    cnf_diff_current_cost_end_date,
    cnf_diff_current_cost_update_commentary,

    cnf_current_cost_value,
    cnf_current_cost_start_date,
    cnf_current_cost_end_date,
    cnf_current_cost_update_commentary
)
SELECT
  tech_sku_id,

  ROUND(MAX(CASE WHEN import_incoterm = 'FOB' THEN cost END)::numeric, 3),
  MAX(CASE WHEN import_incoterm = 'FOB' THEN start_date END),
  MAX(CASE WHEN import_incoterm = 'FOB' THEN end_date END),
  MAX(CASE WHEN import_incoterm = 'FOB' THEN cost_update_commentary END),

  ROUND(MAX(CASE WHEN import_incoterm = 'EXW' THEN cost END)::numeric, 3),
  MAX(CASE WHEN import_incoterm = 'EXW' THEN start_date END),
  MAX(CASE WHEN import_incoterm = 'EXW' THEN end_date END),
  MAX(CASE WHEN import_incoterm = 'EXW' THEN cost_update_commentary END),

  ROUND(MAX(CASE WHEN import_incoterm = 'DDP' THEN cost END)::numeric, 3),
  MAX(CASE WHEN import_incoterm = 'DDP' THEN start_date END),
  MAX(CASE WHEN import_incoterm = 'DDP' THEN end_date END),
  MAX(CASE WHEN import_incoterm = 'DDP' THEN cost_update_commentary END),

  ROUND(MAX(CASE WHEN import_incoterm = 'CNF_DIFF' THEN cost END)::numeric, 3),
  MAX(CASE WHEN import_incoterm = 'CNF_DIFF' THEN start_date END),
  MAX(CASE WHEN import_incoterm = 'CNF_DIFF' THEN end_date END),
  MAX(CASE WHEN import_incoterm = 'CNF_DIFF' THEN cost_update_commentary END),

  ROUND(MAX(CASE WHEN import_incoterm = 'CNF' THEN cost END)::numeric, 3),
  MAX(CASE WHEN import_incoterm = 'CNF' THEN start_date END),
  MAX(CASE WHEN import_incoterm = 'CNF' THEN end_date END),
  MAX(CASE WHEN import_incoterm = 'CNF' THEN cost_update_commentary END)

FROM int.vigent_product_cost_per_incoterm
WHERE rn = 1
GROUP BY tech_sku_id;
