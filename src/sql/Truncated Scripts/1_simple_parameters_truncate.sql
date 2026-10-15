-- Parámetros base
TRUNCATE int.habour_maintenance_fee;
INSERT INTO int.habour_maintenance_fee (value)
SELECT value
FROM public.other_parameters
WHERE parameter = 'habour_maintenance_fee';

TRUNCATE int.merchandise_processing_fee;
INSERT INTO int.merchandise_processing_fee (value)
SELECT value
FROM public.other_parameters
WHERE parameter = 'merchandise_processing_fee';

TRUNCATE int.maximum_weight_in_container;
INSERT INTO int.maximum_weight_in_container (value)
SELECT value
FROM public.other_parameters
WHERE parameter = 'maximum_weight_in_container';

TRUNCATE int.max_capacity_40hc_cbm;
INSERT INTO int.max_capacity_40hc_cbm (value)
SELECT value
FROM public.other_parameters
WHERE parameter = 'max_capacity_40hc_cbm';

TRUNCATE int.max_capacity_45hc_cbm;
INSERT INTO int.max_capacity_45hc_cbm (value)
SELECT value
FROM public.other_parameters
WHERE parameter = 'max_capacity_45hc_cbm';

TRUNCATE int.max_capacity_40std_cbm;
INSERT INTO int.max_capacity_40std_cbm (value)
SELECT value
FROM public.other_parameters
WHERE parameter = 'max_capacity_40std_cbm';

TRUNCATE int.max_capacity_20std_cbm;
INSERT INTO int.max_capacity_20std_cbm (value)
SELECT value
FROM public.other_parameters
WHERE parameter = 'max_capacity_20std_cbm';

TRUNCATE int.max_capacity_53ft_cbm;
INSERT INTO int.max_capacity_53ft_cbm (value)
SELECT value
FROM public.other_parameters
WHERE parameter = 'max_capacity_53ft_cbm';

-- Parámetros del puerto
TRUNCATE int.realese_port_cost;
INSERT INTO int.realese_port_cost (value)
SELECT value
FROM public.port_cost_parameters
WHERE logistic_cost = 'RELEASE'
  AND start_date::date <= CURRENT_DATE
  AND end_date::date   > CURRENT_DATE;

TRUNCATE int.exams_insuarance_port_cost;
INSERT INTO int.exams_insuarance_port_cost (value)
SELECT value
FROM public.port_cost_parameters
WHERE logistic_cost = 'EXAMS_INSURANCE'
  AND start_date::date <= CURRENT_DATE
  AND end_date::date   > CURRENT_DATE;

TRUNCATE int.pallets_port_cost;
INSERT INTO int.pallets_port_cost (value)
SELECT value
FROM public.port_cost_parameters
WHERE logistic_cost = 'PALLETS'
  AND start_date::date <= CURRENT_DATE
  AND end_date::date   > CURRENT_DATE;