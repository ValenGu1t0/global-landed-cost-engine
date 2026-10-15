TRUNCATE int.calc_duties;

INSERT INTO int.calc_duties (
    tech_sku_id,
    duty_percentage,
    fixed_duty_per_piece,
    duty_cost
)
SELECT 
    p.tech_sku_id,

    /* duty_percentage */
    CASE 
        WHEN cca.origin_country IS NULL
            THEN (mpf.value / 100) + (hmf.value / 100) + (ph.hts_duty / 100)
        ELSE (mpf.value / 100) + (hmf.value / 100)
    END AS duty_percentage,

    /* fixed duty */
    ph.fixed_duty_per_piece,

    /* duty_cost final por incoterm */
    CASE dic.incoterm
        WHEN 'FOB' THEN 
            p.fob *
            CASE 
                WHEN cca.origin_country IS NULL
                     THEN (mpf.value / 100) + (hmf.value / 100) + (ph.hts_duty / 100)
                ELSE (mpf.value / 100) + (hmf.value / 100)
            END
            + COALESCE(ph.fixed_duty_per_piece, 0) * p.pieces_per_unit

        WHEN 'EXW' THEN 
            p.exw *
            CASE 
                WHEN cca.origin_country IS NULL
                     THEN (mpf.value / 100) + (hmf.value / 100) + (ph.hts_duty / 100)
                ELSE (mpf.value / 100) + (hmf.value / 100)
            END
            + COALESCE(ph.fixed_duty_per_piece, 0) * p.pieces_per_unit

        WHEN 'DDP' THEN 
            p.ddp *
            CASE 
                WHEN cca.origin_country IS NULL
                     THEN (mpf.value / 100) + (hmf.value / 100) + (ph.hts_duty / 100)
                ELSE (mpf.value / 100) + (hmf.value / 100)
            END
            + COALESCE(ph.fixed_duty_per_piece, 0) * p.pieces_per_unit

        WHEN 'CNF' THEN 
            p.cnf *
            CASE 
                WHEN cca.origin_country IS NULL
                     THEN (mpf.value / 100) + (hmf.value / 100) + (ph.hts_duty / 100)
                ELSE (mpf.value / 100) + (hmf.value / 100)
            END
            + COALESCE(ph.fixed_duty_per_piece, 0) * p.pieces_per_unit

        WHEN 'CNF_DIFF' THEN 
            p.cnf_diff *
            CASE 
                WHEN cca.origin_country IS NULL
                     THEN (mpf.value / 100) + (hmf.value / 100) + (ph.hts_duty / 100)
                ELSE (mpf.value / 100) + (hmf.value / 100)
            END
            + COALESCE(ph.fixed_duty_per_piece, 0) * p.pieces_per_unit
    END AS duty_cost

FROM public.product p
CROSS JOIN int.merchandise_processing_fee mpf
CROSS JOIN int.habour_maintenance_fee hmf
LEFT JOIN int.product_hts ph
       ON ph.tech_sku_id = p.tech_sku_id
LEFT JOIN int.current_commercial_agreements cca
       ON cca.origin_country      = UPPER(p.origin_country)
      AND cca.destination_country = 'UNITED STATES'
      AND (cca.raw_material = 'ALL' OR cca.raw_material = UPPER(p.raw_material))
LEFT JOIN public.incoterm_cost_group dic
       ON UPPER(p.origin_country)  = UPPER(dic.country)
      AND UPPER(p.vendor)          = UPPER(dic.vendor)
      AND UPPER(dic.cost_group)    = 'DUTIES';
