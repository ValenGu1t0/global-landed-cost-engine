/**
 * Landed Cost Calculation Engine
 *
 * Replaces legacy batch SQL files with a fast, deterministic TypeScript engine.
 * Computes:
 * - 3D Carton CBM & CFT
 * - Optimal Container Capacities (20STD, 40STD, 40HC, 45HC, 53FT)
 * - Volume vs Weight constraint optimization
 * - Prorated Ocean, Ground & Port Logistics per unit
 * - Customs Duties & Section 301 Tariffs
 * - Final Landed Cost & Margin Projections
 */

export interface ContainerSpec {
  name: '40HC' | '45HC' | '40STD' | '20STD' | '53FT';
  cbm: number;
  maxWeightKg: number;
  defaultOceanFreight: number;
  defaultGroundFreight: number;
  defaultPortCost: number;
}

export const CONTAINER_SPECS: Record<string, ContainerSpec> = {
  '40HC': {
    name: '40HC',
    cbm: 68.0,
    maxWeightKg: 26000,
    defaultOceanFreight: 3800,
    defaultGroundFreight: 1200,
    defaultPortCost: 450
  },
  '45HC': {
    name: '45HC',
    cbm: 76.0,
    maxWeightKg: 27000,
    defaultOceanFreight: 4300,
    defaultGroundFreight: 1350,
    defaultPortCost: 450
  },
  '40STD': {
    name: '40STD',
    cbm: 58.0,
    maxWeightKg: 26000,
    defaultOceanFreight: 3500,
    defaultGroundFreight: 1100,
    defaultPortCost: 450
  },
  '20STD': {
    name: '20STD',
    cbm: 28.0,
    maxWeightKg: 21000,
    defaultOceanFreight: 2400,
    defaultGroundFreight: 900,
    defaultPortCost: 400
  },
  '53FT': {
    name: '53FT',
    cbm: 110.0,
    maxWeightKg: 20000,
    defaultOceanFreight: 0,
    defaultGroundFreight: 2500,
    defaultPortCost: 0
  }
};

export interface ProductEconomicsInput {
  tech_sku_id?: number;
  hemicode?: string | null;
  status?: string | null;
  vendor?: string | null;
  product_or_kit?: string | null;
  pieces_per_unit?: number | null;
  case_pack?: number | null;
  [key: string]: any;

  // Packaging dimensions & weight
  carton_length_mm?: number | null;
  carton_height_mm?: number | null;
  carton_width_mm?: number | null;
  carton_weight_kg?: number | null;
  cbm_const?: number | null;

  // Manual overrides
  confirmed_carton_per_40hc?: number | null;
  confirmed_carton_per_45hc?: number | null;
  confirmed_carton_per_40std?: number | null;
  confirmed_carton_per_20std?: number | null;
  confirmed_carton_per_53ft?: number | null;

  // Costs
  fob_current_cost_value?: number | null;
  exw_current_cost_value?: number | null;
  ddp_current_cost_value?: number | null;
  cnf_current_cost_value?: number | null;
  mrsp?: number | null;
  commission_percentage?: number | null;

  // HTS & Tariffs
  hts_code?: string | null;
  hts_duty?: number | null; // e.g. 3.5 for 3.5%
  fixed_duty_per_piece?: number | null;
  tariff?: number | null; // e.g. 25 for 25% Section 301
}

export interface CalculatedProductEconomics {
  // Dimensions
  carton_length_in: number;
  carton_height_in: number;
  carton_width_in: number;
  carton_weight_lb: number;
  case_cbm: number;
  case_cft: number;
  pieces_per_carton: number;

  // Duties & Tariffs
  base_cost: number;
  duty_percentage: number;
  fixed_duty_per_piece: number;
  duty_cost: number;
  tariff: number;
  tariff_cost: number;
  commission_amount: number;

  // 40HC
  calculated_cartons_40hc_per_volume: number;
  calculated_case_pack_40hc_per_volume: number;
  optimal_cartons_per_40hc: number;
  optimal_pieces_per_40hc: number;
  logistic_cost_40hc: number;
  landed_cost_40hc: number;

  // 45HC
  calculated_cartons_45hc_per_volume: number;
  calculated_case_pack_45hc_per_volume: number;
  optimal_cartons_per_45hc: number;
  optimal_pieces_per_45hc: number;
  logistic_cost_45hc: number;
  landed_cost_45hc: number;

  // 40STD
  calculated_cartons_40std_per_volume: number;
  calculated_case_pack_40std_per_volume: number;
  optimal_cartons_per_40std: number;
  optimal_pieces_per_40std: number;
  logistic_cost_40std: number;
  landed_cost_40std: number;

  // 20STD
  calculated_cartons_20std_per_volume: number;
  calculated_case_pack_20std_per_volume: number;
  optimal_cartons_per_20std: number;
  optimal_pieces_per_20std: number;
  logistic_cost_20std: number;
  landed_cost_20std: number;

  // 53FT
  calculated_cartons_53ft_per_volume: number;
  calculated_case_pack_53ft_per_volume: number;
  optimal_cartons_per_53ft: number;
  optimal_pieces_per_53ft: number;
  logistic_cost_53ft: number;
  landed_cost_53ft: number;
}

const round3 = (n: number): number =>
  Math.round((n + Number.EPSILON) * 1000) / 1000;
const round2 = (n: number): number =>
  Math.round((n + Number.EPSILON) * 100) / 100;

export function calculateProductEconomics(
  input: ProductEconomicsInput
): CalculatedProductEconomics {
  const l_mm = Number(input.carton_length_mm) || 0;
  const h_mm = Number(input.carton_height_mm) || 0;
  const w_mm = Number(input.carton_width_mm) || 0;
  const weight_kg = Number(input.carton_weight_kg) || 0;
  const cbmConst = Number(input.cbm_const) || 0;

  // Conversions (mm -> in, kg -> lb)
  const carton_length_in = round2(l_mm / 25.4);
  const carton_height_in = round2(h_mm / 25.4);
  const carton_width_in = round2(w_mm / 25.4);
  const carton_weight_lb = round2(weight_kg * 2.20462);

  // Volume: CBM and CFT
  const rawCbm = (l_mm / 1000) * (h_mm / 1000) * (w_mm / 1000) + cbmConst;
  const case_cbm = round3(rawCbm > 0 ? rawCbm : 0.001);
  const case_cft = round3(case_cbm * 35.3147);

  const piecesPerUnit = Number(input.pieces_per_unit) || 1;
  const casePack = Number(input.case_pack) || 1;
  const pieces_per_carton = piecesPerUnit * casePack;

  // Base Cost (FOB is the global standard benchmark)
  const base_cost =
    Number(input.fob_current_cost_value) ||
    Number(input.exw_current_cost_value) ||
    Number(input.cnf_current_cost_value) ||
    Number(input.ddp_current_cost_value) ||
    0;

  // Duties & Tariffs
  const duty_percentage = Number(input.hts_duty) || 0;
  const fixed_duty = Number(input.fixed_duty_per_piece) || 0;
  const duty_cost = round3(base_cost * (duty_percentage / 100) + fixed_duty);

  const tariffRate = Number(input.tariff) || 0;
  const tariff_cost = round3(base_cost * (tariffRate / 100));

  const mrsp = Number(input.mrsp) || 0;
  const commPct = Number(input.commission_percentage) || 0;
  const commission_amount = round3(mrsp * (commPct / 100));

  // Helper for single container calculations
  const computeContainer = (
    spec: ContainerSpec,
    confirmedCartons?: number | null
  ) => {
    // 1. By Volume
    const volCartons = Math.floor(spec.cbm / (case_cbm || 0.001));
    const calcCartonsVol =
      confirmedCartons && confirmedCartons > 0 ? confirmedCartons : volCartons;
    const calcCasePackVol = calcCartonsVol * casePack;

    // 2. By Weight
    const weightCartons =
      weight_kg > 0 ? Math.floor(spec.maxWeightKg / weight_kg) : volCartons;

    // 3. Optimal is the lower limit (volume vs weight)
    const optimalCartons = Math.max(1, Math.min(calcCartonsVol, weightCartons));
    const optimalPieces = optimalCartons * pieces_per_carton;

    // 4. Logistics Cost per piece
    const totalFreight =
      spec.defaultOceanFreight +
      spec.defaultGroundFreight +
      spec.defaultPortCost;
    const logisticCostPerPiece = round3(totalFreight / (optimalPieces || 1));

    // 5. Landed Cost
    const landedCost = round3(
      base_cost + duty_cost + tariff_cost + logisticCostPerPiece
    );

    return {
      calcCartonsVol,
      calcCasePackVol,
      optimalCartons,
      optimalPieces,
      logisticCostPerPiece,
      landedCost
    };
  };

  const c40hc = computeContainer(
    CONTAINER_SPECS['40HC'],
    input.confirmed_carton_per_40hc
  );
  const c45hc = computeContainer(
    CONTAINER_SPECS['45HC'],
    input.confirmed_carton_per_45hc
  );
  const c40std = computeContainer(
    CONTAINER_SPECS['40STD'],
    input.confirmed_carton_per_40std
  );
  const c20std = computeContainer(
    CONTAINER_SPECS['20STD'],
    input.confirmed_carton_per_20std
  );
  const c53ft = computeContainer(
    CONTAINER_SPECS['53FT'],
    input.confirmed_carton_per_53ft
  );

  return {
    carton_length_in,
    carton_height_in,
    carton_width_in,
    carton_weight_lb,
    case_cbm,
    case_cft,
    pieces_per_carton,

    base_cost,
    duty_percentage,
    fixed_duty_per_piece: fixed_duty,
    duty_cost,
    tariff: tariffRate,
    tariff_cost,
    commission_amount,

    // 40HC
    calculated_cartons_40hc_per_volume: c40hc.calcCartonsVol,
    calculated_case_pack_40hc_per_volume: c40hc.calcCasePackVol,
    optimal_cartons_per_40hc: c40hc.optimalCartons,
    optimal_pieces_per_40hc: c40hc.optimalPieces,
    logistic_cost_40hc: c40hc.logisticCostPerPiece,
    landed_cost_40hc: c40hc.landedCost,

    // 45HC
    calculated_cartons_45hc_per_volume: c45hc.calcCartonsVol,
    calculated_case_pack_45hc_per_volume: c45hc.calcCasePackVol,
    optimal_cartons_per_45hc: c45hc.optimalCartons,
    optimal_pieces_per_45hc: c45hc.optimalPieces,
    logistic_cost_45hc: c45hc.logisticCostPerPiece,
    landed_cost_45hc: c45hc.landedCost,

    // 40STD
    calculated_cartons_40std_per_volume: c40std.calcCartonsVol,
    calculated_case_pack_40std_per_volume: c40std.calcCasePackVol,
    optimal_cartons_per_40std: c40std.optimalCartons,
    optimal_pieces_per_40std: c40std.optimalPieces,
    logistic_cost_40std: c40std.logisticCostPerPiece,
    landed_cost_40std: c40std.landedCost,

    // 20STD
    calculated_cartons_20std_per_volume: c20std.calcCartonsVol,
    calculated_case_pack_20std_per_volume: c20std.calcCasePackVol,
    optimal_cartons_per_20std: c20std.optimalCartons,
    optimal_pieces_per_20std: c20std.optimalPieces,
    logistic_cost_20std: c20std.logisticCostPerPiece,
    landed_cost_20std: c20std.landedCost,

    // 53FT
    calculated_cartons_53ft_per_volume: c53ft.calcCartonsVol,
    calculated_case_pack_53ft_per_volume: c53ft.calcCasePackVol,
    optimal_cartons_per_53ft: c53ft.optimalCartons,
    optimal_pieces_per_53ft: c53ft.optimalPieces,
    logistic_cost_53ft: c53ft.logisticCostPerPiece,
    landed_cost_53ft: c53ft.landedCost
  };
}
