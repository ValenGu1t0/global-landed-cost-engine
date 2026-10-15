CREATE TABLE IF NOT EXISTS int.kit_part_non_sellable_costs (
    tech_sku_id bigint PRIMARY KEY,
    cost numeric
);

TRUNCATE int.kit_part_non_sellable_costs;

INSERT INTO int.kit_part_non_sellable_costs (tech_sku_id, cost)
SELECT tech_sku_id, ddp AS cost
FROM public.product
WHERE product_or_kit = 'PRODUCT_KIT_NON_SELLABLE';

CREATE TABLE IF NOT EXISTS int.kit_part_cost_per_container (
    tech_sku_id_kit bigint,
    tech_sku_id_part bigint,
    cost_40hc  numeric,
    cost_45hc  numeric,
    cost_40std numeric,
    cost_20std numeric,
    cost_53ft  numeric
);

TRUNCATE int.kit_part_cost_per_container;

INSERT INTO int.kit_part_cost_per_container (
    tech_sku_id_kit,
    tech_sku_id_part,
    cost_40hc, cost_45hc, cost_40std, cost_20std, cost_53ft
)
SELECT
    pk.tech_sku_id_kit,
    pk.tech_sku_id_part,

    CASE 
      WHEN part.product_or_kit = 'PRODUCT_KIT_SELLABLE'     THEN lc40hc.landed_cost_40hc
      WHEN part.product_or_kit = 'PRODUCT_KIT_NON_SELLABLE' THEN kpc.cost
    END AS cost_40hc,

    CASE 
      WHEN part.product_or_kit = 'PRODUCT_KIT_SELLABLE'     THEN lc45hc.landed_cost_45hc
      WHEN part.product_or_kit = 'PRODUCT_KIT_NON_SELLABLE' THEN kpc.cost
    END AS cost_45hc,

    CASE 
      WHEN part.product_or_kit = 'PRODUCT_KIT_SELLABLE'     THEN lc40std.landed_cost_40std
      WHEN part.product_or_kit = 'PRODUCT_KIT_NON_SELLABLE' THEN kpc.cost
    END AS cost_40std,

    CASE 
      WHEN part.product_or_kit = 'PRODUCT_KIT_SELLABLE'     THEN lc20std.landed_cost_20std
      WHEN part.product_or_kit = 'PRODUCT_KIT_NON_SELLABLE' THEN kpc.cost
    END AS cost_20std,

    CASE 
      WHEN part.product_or_kit = 'PRODUCT_KIT_SELLABLE'     THEN lc53ft.landed_cost_53ft
      WHEN part.product_or_kit = 'PRODUCT_KIT_NON_SELLABLE' THEN kpc.cost
    END AS cost_53ft

FROM public.product_kits pk
INNER JOIN public.product part
        ON part.tech_sku_id = pk.tech_sku_id_part
LEFT JOIN int.kit_part_non_sellable_costs kpc
       ON kpc.tech_sku_id = part.tech_sku_id
      AND part.product_or_kit = 'PRODUCT_KIT_NON_SELLABLE'
LEFT JOIN int.landed_cost_40hc  lc40hc  ON lc40hc.tech_sku_id  = part.tech_sku_id
LEFT JOIN int.landed_cost_45hc  lc45hc  ON lc45hc.tech_sku_id  = part.tech_sku_id
LEFT JOIN int.landed_cost_40std lc40std ON lc40std.tech_sku_id = part.tech_sku_id
LEFT JOIN int.landed_cost_20std lc20std ON lc20std.tech_sku_id = part.tech_sku_id
LEFT JOIN int.landed_cost_53ft  lc53ft  ON lc53ft.tech_sku_id  = part.tech_sku_id;

CREATE TABLE IF NOT EXISTS int.kit_landed_cost (
    tech_sku_id_kit bigint PRIMARY KEY,
    kit_cost_40hc  numeric,
    kit_cost_45hc  numeric,
    kit_cost_40std numeric,
    kit_cost_20std numeric,
    kit_cost_53ft  numeric
);

TRUNCATE int.kit_landed_cost;

INSERT INTO int.kit_landed_cost (
    tech_sku_id_kit,
    kit_cost_40hc,
    kit_cost_45hc,
    kit_cost_40std,
    kit_cost_20std,
    kit_cost_53ft
)
SELECT 
    tech_sku_id_kit,
    CASE WHEN COUNT(*) = COUNT(cost_40hc)  THEN SUM(cost_40hc)  ELSE NULL END AS kit_cost_40hc,
    CASE WHEN COUNT(*) = COUNT(cost_45hc)  THEN SUM(cost_45hc)  ELSE NULL END AS kit_cost_45hc,
    CASE WHEN COUNT(*) = COUNT(cost_40std) THEN SUM(cost_40std) ELSE NULL END AS kit_cost_40std,
    CASE WHEN COUNT(*) = COUNT(cost_20std) THEN SUM(cost_20std) ELSE NULL END AS kit_cost_20std,
    CASE WHEN COUNT(*) = COUNT(cost_53ft)  THEN SUM(cost_53ft)  ELSE NULL END AS kit_cost_53ft
FROM int.kit_part_cost_per_container
GROUP BY tech_sku_id_kit;
