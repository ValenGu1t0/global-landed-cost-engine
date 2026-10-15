TRUNCATE int.calc_tariff;

INSERT INTO int.calc_tariff (
    tech_sku_id,
    tariff
)
SELECT
    p.tech_sku_id,

    CASE tic.incoterm

        WHEN 'FOB' THEN 
            CASE 
                WHEN td.duty_percentage IS NULL THEN NULL
                WHEN (td.duty_percentage - 0.0047) > ptf.value THEN 0
                ELSE ROUND(((ptf.value - (td.duty_percentage - 0.0047)) * p.fob)::numeric, 4)
            END

        WHEN 'EXW' THEN 
            CASE 
                WHEN td.duty_percentage IS NULL THEN NULL
                WHEN (td.duty_percentage - 0.0047) > ptf.value THEN 0
                ELSE ROUND(((ptf.value - (td.duty_percentage - 0.0047)) * p.exw)::numeric, 4)
            END

        WHEN 'DDP' THEN 
            CASE 
                WHEN td.duty_percentage IS NULL THEN NULL
                WHEN (td.duty_percentage - 0.0047) > ptf.value THEN 0
                ELSE ROUND(((ptf.value - (td.duty_percentage - 0.0047)) * p.ddp)::numeric, 4)
            END

        WHEN 'CNF' THEN 
            CASE 
                WHEN td.duty_percentage IS NULL THEN NULL
                WHEN (td.duty_percentage - 0.0047) > ptf.value THEN 0
                ELSE ROUND(((ptf.value - (td.duty_percentage - 0.0047)) * p.cnf)::numeric, 4)
            END

        WHEN 'CNF_DIFF' THEN 
            CASE 
                WHEN td.duty_percentage IS NULL THEN NULL
                WHEN (td.duty_percentage - 0.0047) > ptf.value THEN 0
                ELSE ROUND(((ptf.value - (td.duty_percentage - 0.0047)) * p.cnf_diff)::numeric, 4)
            END

    END AS tariff

FROM public.product p
LEFT JOIN int.product_tariff_final ptf
  ON ptf.tech_sku_id = p.tech_sku_id
LEFT JOIN int.calc_duties td
  ON td.tech_sku_id = p.tech_sku_id
LEFT JOIN public.incoterm_cost_group tic
  ON UPPER(p.origin_country) = UPPER(tic.country)
 AND UPPER(p.vendor)         = UPPER(tic.vendor)
 AND UPPER(tic.cost_group)   = 'TARIFF';
