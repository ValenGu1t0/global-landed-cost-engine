TRUNCATE int.calc_20std;

INSERT INTO int.calc_20std (
    tech_sku_id,
    case_cbm,
    calculated_cartons_20std_per_volume,
    calculated_case_pack_20std_per_volume,
    optimal_cartons_per_20std,
    optimal_pieces_per_20std
)
SELECT
    p.tech_sku_id,
    bd.case_cbm,

    /* calculated_cartons_20std_per_volume */
    COALESCE(
        CASE 
            WHEN p.polybag_per_pallet IS NOT NULL
             AND p.polybag_product_pallets_per_20std IS NOT NULL
                THEN p.polybag_per_pallet * p.polybag_product_pallets_per_20std
            ELSE p.confirmed_carton_per_20std
        END,
        FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
    ) AS calculated_cartons_20std_per_volume,

    /* calculated_case_pack_20std_per_volume */
    COALESCE(
        CASE 
            WHEN p.polybag_per_pallet IS NOT NULL
             AND p.polybag_product_pallets_per_20std IS NOT NULL
                THEN p.polybag_per_pallet * p.polybag_product_pallets_per_20std
            ELSE p.confirmed_carton_per_20std
        END,
        FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
    ) * p.case_pack AS calculated_case_pack_20std_per_volume,

    /* optimal_cartons_per_20std */
    CASE
        WHEN FLOOR(mw.value / NULLIF(p.carton_weight_kg, 0)) <
             COALESCE(
                 CASE 
                     WHEN p.polybag_per_pallet IS NOT NULL
                      AND p.polybag_product_pallets_per_20std IS NOT NULL
                        THEN p.polybag_per_pallet * p.polybag_product_pallets_per_20std
                     ELSE p.confirmed_carton_per_20std
                 END,
                 FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
             )
        THEN FLOOR(mw.value / NULLIF(p.carton_weight_kg, 0))

        ELSE COALESCE(
             CASE 
                 WHEN p.polybag_per_pallet IS NOT NULL
                  AND p.polybag_product_pallets_per_20std IS NOT NULL
                    THEN p.polybag_per_pallet * p.polybag_product_pallets_per_20std
                 ELSE p.confirmed_carton_per_20std
             END,
             FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
        )
    END AS optimal_cartons_per_20std,

    /* optimal_pieces_per_20std */
    CASE
        WHEN FLOOR(mw.value / NULLIF(p.carton_weight_kg, 0)) <
             COALESCE(
                  CASE 
                      WHEN p.polybag_per_pallet IS NOT NULL
                       AND p.polybag_product_pallets_per_20std IS NOT NULL
                       AND p.pieces_per_polybag IS NOT NULL
                        THEN p.polybag_per_pallet * p.polybag_product_pallets_per_20std
                      ELSE p.confirmed_carton_per_20std
                  END,
                  FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
              )
        THEN FLOOR(mw.value / NULLIF(p.carton_weight_kg, 0)) * p.case_pack

        ELSE 
            CASE  
                WHEN p.polybag_per_pallet IS NOT NULL
                 AND p.polybag_product_pallets_per_20std IS NOT NULL
                 AND p.pieces_per_polybag IS NOT NULL
                THEN p.polybag_per_pallet * p.polybag_product_pallets_per_20std * p.pieces_per_polybag

                ELSE
                    COALESCE(
                        CASE 
                            WHEN p.polybag_per_pallet IS NOT NULL
                             AND p.polybag_product_pallets_per_20std IS NOT NULL
                                THEN p.polybag_per_pallet * p.polybag_product_pallets_per_20std
                            ELSE p.confirmed_carton_per_20std
                        END,
                        FLOOR(cap.value / NULLIF(bd.case_cbm, 0))
                    ) * p.case_pack
            END
    END AS optimal_pieces_per_20std

FROM public.product p
CROSS JOIN int.maximum_weight_in_container mw
CROSS JOIN int.max_capacity_20std_cbm cap
LEFT JOIN int.calc_carton_dims bd
  ON bd.tech_sku_id = p.tech_sku_id;
