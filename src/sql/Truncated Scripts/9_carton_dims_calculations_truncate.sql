TRUNCATE int.calc_carton_dims;

INSERT INTO int.calc_carton_dims (
    tech_sku_id,
    carton_length_in,
    carton_height_in,
    carton_width_in,
    carton_weight_lb,
    case_cbm
)
SELECT
    p.tech_sku_id,
    p.carton_length_mm / 25.4 AS carton_length_in,
    p.carton_height_mm / 25.4 AS carton_height_in,
    p.carton_width_mm  / 25.4 AS carton_width_in,
    p.carton_weight_kg * 2.204 AS carton_weight_lb,
    CASE
        WHEN p.cbm IS NOT NULL THEN p.cbm
        ELSE
            (
                (p.carton_height_mm / 1000)
              * (p.carton_length_mm / 1000)
              * (p.carton_width_mm  / 1000)
              + p.cbm_const
            )
    END AS case_cbm
FROM public.product p;
