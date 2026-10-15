CREATE TABLE IF NOT EXISTS int.product_commission (
    tech_sku_id bigint PRIMARY KEY,
    commission_amount numeric
);

TRUNCATE int.product_commission;

INSERT INTO int.product_commission (
    tech_sku_id,
    commission_amount
)
SELECT
    p.tech_sku_id,
    CASE UPPER(icg.incoterm)

        WHEN 'FOB' THEN 
            CASE 
                WHEN p.commission_percentage IS NULL OR p.fob IS NULL THEN NULL
                ELSE ROUND((p.commission_percentage * p.fob)::numeric, 4)
            END

        WHEN 'EXW' THEN 
            CASE 
                WHEN p.commission_percentage IS NULL OR p.exw IS NULL THEN NULL
                ELSE ROUND((p.commission_percentage * p.exw)::numeric, 4)
            END

        WHEN 'DDP' THEN 
            CASE 
                WHEN p.commission_percentage IS NULL OR p.ddp IS NULL THEN NULL
                ELSE ROUND((p.commission_percentage * p.ddp)::numeric, 4)
            END

        WHEN 'CNF' THEN 
            CASE 
                WHEN p.commission_percentage IS NULL OR p.cnf IS NULL THEN NULL
                ELSE ROUND((p.commission_percentage * p.cnf)::numeric, 4)
            END

        WHEN 'CNF_DIFF' THEN 
            CASE 
                WHEN p.commission_percentage IS NULL OR p.cnf_diff IS NULL THEN NULL
                ELSE ROUND((p.commission_percentage * p.cnf_diff)::numeric, 4)
            END

        ELSE NULL
    END AS commission_amount

FROM public.product p
LEFT JOIN public.incoterm_cost_group icg
       ON UPPER(p.origin_country) = UPPER(icg.country)
      AND UPPER(p.vendor)         = UPPER(icg.vendor)
      AND UPPER(icg.cost_group)   = 'COMMISSION';
