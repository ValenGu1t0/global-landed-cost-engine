/**
 * Landed Cost Calculation Engine
 *
 * Replaces legacy batch SQL files with a fast, deterministic TypeScript engine.
 * Computes:
 * - Product Unit Dimensions (mm, cm, in) & Weight (kg, lb)
 * - 3D Carton CBM & CFT
 * - Optimal Container Capacities (20STD, 40STD, 40HC, 45HC, 53FT)
 * - Volume vs Weight constraint optimization
 * - Full 5-Incoterm Progression (EXW -> FOB -> CNF -> CNF Diff -> DDP)
 * - Multi-Country Destination Landed Prices (USA, Canada, France, Morocco, Israel)
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

export interface DestinationCountrySpec {
  code: 'USA' | 'CANADA' | 'FRANCE' | 'MOROCCO' | 'ISRAEL';
  label: string;
  flag: string;
  port: string;
  freightMultiplier: number;
  defaultDutyAdderPct: number;
  customsClearancePct: number;
}

export const DESTINATION_CORRIDORS: Record<string, DestinationCountrySpec> = {
  USA: {
    code: 'USA',
    label: 'USA',
    flag: '🇺🇸',
    port: 'NY / Savannah / LA',
    freightMultiplier: 1.0,
    defaultDutyAdderPct: 6.5,
    customsClearancePct: 1.5
  },
  CANADA: {
    code: 'CANADA',
    label: 'Canada',
    flag: '🇨🇦',
    port: 'Montreal / Vancouver',
    freightMultiplier: 1.28,
    defaultDutyAdderPct: 9.5,
    customsClearancePct: 3.2
  },
  FRANCE: {
    code: 'FRANCE',
    label: 'France',
    flag: '🇫🇷',
    port: 'Le Havre / Marseille',
    freightMultiplier: 1.18,
    defaultDutyAdderPct: 8.0,
    customsClearancePct: 2.5
  },
  MOROCCO: {
    code: 'MOROCCO',
    label: 'Morocco',
    flag: '🇲🇦',
    port: 'Tanger-Med / Casablanca',
    freightMultiplier: 1.08,
    defaultDutyAdderPct: 7.2,
    customsClearancePct: 2.0
  },
  ISRAEL: {
    code: 'ISRAEL',
    label: 'Israel',
    flag: '🇮🇱',
    port: 'Haifa / Ashdod',
    freightMultiplier: 1.38,
    defaultDutyAdderPct: 10.5,
    customsClearancePct: 3.8
  }
};

const ORIGIN_INLAND_RATES: Record<string, number> = {
  BRAZIL: 0.055,
  CHINA: 0.045,
  VIETNAM: 0.05,
  INDIA: 0.06,
  MEXICO: 0.035,
  TURKEY: 0.048,
  COLOMBIA: 0.052,
  ARGENTINA: 0.058
};

export interface ProductEconomicsInput {
  tech_sku_id?: number;
  cn_code?: string | null;
  status?: string | null;
  vendor?: string | null;
  origin_country?: string | null;
  product_or_kit?: string | null;
  pieces_per_unit?: number | null;
  case_pack?: number | null;
  [key: string]: any;

  // Product unit dimensions & weight
  product_length_mm?: number | null;
  product_height_mm?: number | null;
  product_width_mm?: number | null;
  product_length_cm?: number | null;
  product_height_cm?: number | null;
  product_width_cm?: number | null;
  product_length_in?: number | null;
  product_height_in?: number | null;
  product_width_in?: number | null;
  product_weight_kg?: number | null;
  product_weight_lb?: number | null;

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

  // Costs (support both table column names)
  fob?: number | null;
  exw?: number | null;
  cnf?: number | null;
  cnf_diff?: number | null;
  ddp?: number | null;
  fob_current_cost_value?: number | null;
  exw_current_cost_value?: number | null;
  ddp_current_cost_value?: number | null;
  cnf_current_cost_value?: number | null;
  cnf_diff_current_cost_value?: number | null;
  mrsp?: number | null;
  commission_percentage?: number | null;

  // HTS & Tariffs
  hts_code?: string | null;
  hts_duty?: number | null; // e.g. 3.5 for 3.5%
  fixed_duty_per_piece?: number | null;
  tariff?: number | null; // e.g. 25 for 25% Section 301
}

export interface CalculatedProductEconomics {
  // Product Unit Dimensions (mm, cm, in) & Weight
  product_length_mm: number;
  product_height_mm: number;
  product_width_mm: number;
  product_length_cm: number;
  product_height_cm: number;
  product_width_cm: number;
  product_length_in: number;
  product_height_in: number;
  product_width_in: number;
  product_weight_kg: number;
  product_weight_lb: number;

  // Carton Dimensions
  carton_length_in: number;
  carton_height_in: number;
  carton_width_in: number;
  carton_weight_lb: number;
  case_cbm: number;
  case_cft: number;
  pieces_per_carton: number;

  // 5 Base Incoterms
  exw_current_cost_value: number;
  fob_current_cost_value: number;
  cnf_current_cost_value: number;
  cnf_diff_current_cost_value: number;
  ddp_current_cost_value: number;

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

  // Multi-Country Destination Landed Prices
  landed_cost_usa: number;
  landed_cost_canada: number;
  landed_cost_france: number;
  landed_cost_morocco: number;
  landed_cost_israel: number;
}

const round3 = (n: number): number =>
  Math.round((n + Number.EPSILON) * 1000) / 1000;
const round2 = (n: number): number =>
  Math.round((n + Number.EPSILON) * 100) / 100;

export function calculateProductEconomics(
  input: ProductEconomicsInput
): CalculatedProductEconomics {
  const l_mm = Number(input.carton_length_mm) || 400;
  const h_mm = Number(input.carton_height_mm) || 300;
  const w_mm = Number(input.carton_width_mm) || 300;
  const weight_kg = Number(input.carton_weight_kg) || 8;
  const cbmConst = Number(input.cbm_const) || 0;

  const piecesPerUnit = Number(input.pieces_per_unit) || 1;
  const casePack = Number(input.case_pack) || 1;
  const pieces_per_carton = Math.max(1, piecesPerUnit * casePack);

  // Product unit dimensions (derive from mm, cm, in, or estimate from carton)
  const rawProdLengthMm =
    Number(input.product_length_mm) ||
    (Number(input.product_length_cm)
      ? Number(input.product_length_cm) * 10
      : 0) ||
    (Number(input.product_length_in)
      ? Number(input.product_length_in) * 25.4
      : 0) ||
    round2((l_mm / Math.cbrt(Math.max(1, casePack))) * 0.88);

  const rawProdWidthMm =
    Number(input.product_width_mm) ||
    (Number(input.product_width_cm)
      ? Number(input.product_width_cm) * 10
      : 0) ||
    (Number(input.product_width_in)
      ? Number(input.product_width_in) * 25.4
      : 0) ||
    round2((w_mm / Math.cbrt(Math.max(1, casePack))) * 0.88);

  const rawProdHeightMm =
    Number(input.product_height_mm) ||
    (Number(input.product_height_cm)
      ? Number(input.product_height_cm) * 10
      : 0) ||
    (Number(input.product_height_in)
      ? Number(input.product_height_in) * 25.4
      : 0) ||
    round2(h_mm * 0.9);

  const product_length_mm = round2(rawProdLengthMm);
  const product_width_mm = round2(rawProdWidthMm);
  const product_height_mm = round2(rawProdHeightMm);

  const product_length_cm = round2(product_length_mm / 10);
  const product_width_cm = round2(product_width_mm / 10);
  const product_height_cm = round2(product_height_mm / 10);

  const product_length_in = round2(product_length_mm / 25.4);
  const product_width_in = round2(product_width_mm / 25.4);
  const product_height_in = round2(product_height_mm / 25.4);

  const rawProdWeightKg =
    Number(input.product_weight_kg) ||
    (Number(input.product_weight_lb)
      ? Number(input.product_weight_lb) / 2.20462
      : 0) ||
    round3((weight_kg * 0.92) / Math.max(1, casePack));

  const product_weight_kg = round3(rawProdWeightKg);
  const product_weight_lb = round2(product_weight_kg * 2.20462);

  // Carton Conversions (mm -> in, kg -> lb)
  const carton_length_in = round2(l_mm / 25.4);
  const carton_height_in = round2(h_mm / 25.4);
  const carton_width_in = round2(w_mm / 25.4);
  const carton_weight_lb = round2(weight_kg * 2.20462);

  // Volume: CBM and CFT
  const rawCbm = (l_mm / 1000) * (h_mm / 1000) * (w_mm / 1000) + cbmConst;
  const case_cbm = round3(rawCbm > 0 ? rawCbm : 0.001);
  const case_cft = round3(case_cbm * 35.3147);

  // Origin Country Inland Rate (EXW <-> FOB step)
  const originKey = (input.origin_country || 'CHINA').trim().toUpperCase();
  const originInlandRate = ORIGIN_INLAND_RATES[originKey] ?? 0.05;

  // Resolve Base Cost (FOB benchmark) & EXW
  const inputFob = Number(input.fob_current_cost_value ?? input.fob) || 0;
  const inputExw = Number(input.exw_current_cost_value ?? input.exw) || 0;
  const inputCnf = Number(input.cnf_current_cost_value ?? input.cnf) || 0;
  const inputDdp = Number(input.ddp_current_cost_value ?? input.ddp) || 0;
  const inputCnfDiff =
    Number(input.cnf_diff_current_cost_value ?? input.cnf_diff) || 0;

  let fob_current_cost_value = inputFob;
  let exw_current_cost_value = inputExw;

  if (fob_current_cost_value > 0 && exw_current_cost_value <= 0) {
    exw_current_cost_value = round2(
      fob_current_cost_value / (1 + originInlandRate)
    );
  } else if (exw_current_cost_value > 0 && fob_current_cost_value <= 0) {
    fob_current_cost_value = round2(
      exw_current_cost_value * (1 + originInlandRate)
    );
  } else if (fob_current_cost_value <= 0 && exw_current_cost_value <= 0) {
    const fallbackBase = inputCnf > 0 ? inputCnf * 0.9 : inputDdp * 0.78;
    fob_current_cost_value = round2(fallbackBase);
    exw_current_cost_value = round2(
      fob_current_cost_value / (1 + originInlandRate)
    );
  }

  const base_cost = fob_current_cost_value;

  // Duties & Tariffs (Default MFN + Section 301 if China)
  const duty_percentage =
    input.hts_duty != null
      ? Number(input.hts_duty)
      : originKey === 'BRAZIL'
        ? 6.0
        : 4.5;
  const fixed_duty = Number(input.fixed_duty_per_piece) || 0;
  const duty_cost = round3(base_cost * (duty_percentage / 100) + fixed_duty);

  const tariffRate =
    input.tariff != null
      ? Number(input.tariff)
      : originKey === 'CHINA'
        ? 25
        : 0;
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
    const oceanAndPortPerPiece = round3(
      (spec.defaultOceanFreight + spec.defaultPortCost) / (optimalPieces || 1)
    );

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
      oceanAndPortPerPiece,
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

  // Derive remaining Incoterms (CNF, CNF Diff, DDP) from 40HC benchmark when not explicitly set
  const cnf_current_cost_value =
    inputCnf > 0
      ? round2(inputCnf)
      : round2(fob_current_cost_value + c40hc.oceanAndPortPerPiece);

  const cnf_diff_current_cost_value =
    inputCnfDiff > 0
      ? round2(inputCnfDiff)
      : round2(Math.max(0.01, cnf_current_cost_value - fob_current_cost_value));

  const ddp_current_cost_value =
    inputDdp > 0 ? round2(inputDdp) : round2(c40hc.landedCost);

  // Multi-Country Destination Landed Cost Calculation
  // Reflects how a factory cost (e.g., $100 pallet/set in Brazil or unit in Asia)
  // lands at different prices in USA ($120), Canada ($130), France ($126.5), Morocco ($123.5), Israel ($134.2)
  const computeCountryLanded = (country: DestinationCountrySpec): number => {
    if (base_cost <= 0) return 0;

    // Corridor adjustment by origin country
    const isSouthAmericaOrigin =
      originKey === 'BRAZIL' ||
      originKey === 'ARGENTINA' ||
      originKey === 'COLOMBIA';

    if (country.code === 'USA') {
      // USA uses the exact 40HC Landed Cost benchmark
      return round2(c40hc.landedCost);
    }

    // Freight component scaled by destination corridor
    const corridorLogistics =
      c40hc.logisticCostPerPiece * country.freightMultiplier;

    // Destination customs duty + local clearance/port fees
    const effectiveDutyPct = isSouthAmericaOrigin
      ? country.defaultDutyAdderPct + country.customsClearancePct
      : duty_percentage +
        country.defaultDutyAdderPct * 0.65 +
        country.customsClearancePct;

    const destinationTaxAndDuty = base_cost * (effectiveDutyPct / 100);

    return round2(base_cost + corridorLogistics + destinationTaxAndDuty);
  };

  const landed_cost_usa = computeCountryLanded(DESTINATION_CORRIDORS.USA);
  const landed_cost_canada = computeCountryLanded(DESTINATION_CORRIDORS.CANADA);
  const landed_cost_france = computeCountryLanded(DESTINATION_CORRIDORS.FRANCE);
  const landed_cost_morocco = computeCountryLanded(
    DESTINATION_CORRIDORS.MOROCCO
  );
  const landed_cost_israel = computeCountryLanded(DESTINATION_CORRIDORS.ISRAEL);

  return {
    product_length_mm,
    product_height_mm,
    product_width_mm,
    product_length_cm,
    product_height_cm,
    product_width_cm,
    product_length_in,
    product_height_in,
    product_width_in,
    product_weight_kg,
    product_weight_lb,

    carton_length_in,
    carton_height_in,
    carton_width_in,
    carton_weight_lb,
    case_cbm,
    case_cft,
    pieces_per_carton,

    exw_current_cost_value,
    fob_current_cost_value,
    cnf_current_cost_value,
    cnf_diff_current_cost_value,
    ddp_current_cost_value,

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
    landed_cost_53ft: c53ft.landedCost,

    // Multi-Country Destination Landed Prices
    landed_cost_usa,
    landed_cost_canada,
    landed_cost_france,
    landed_cost_morocco,
    landed_cost_israel
  };
}
