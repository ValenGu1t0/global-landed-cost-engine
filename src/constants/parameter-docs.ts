import { ParameterInfoBannerProps } from '@/components/parameters/parameter-info-banner';

export const PARAMETER_DOCS: Record<string, ParameterInfoBannerProps> = {
  HTS: {
    title: 'Harmonized Tariff Schedule (HTS)',
    parameterKey: 'HTS',
    cardinality: 'multiple',
    purpose:
      'Standardized 10-digit classification codes used by customs authorities worldwide to classify goods and determine statutory import duty rates.',
    validityRules:
      'Multiple concurrent active codes allowed (N Active). Products span diverse commodity classifications (plastics, glass, textiles, metals), each requiring its own active HTS entry.',
    calculationImpact:
      'Directly dictates the base ad-valorem duty percentage and any fixed duty per piece applied against the product FOB valuation.',
    formula: 'Duty Cost = (FOB * duty_percentage) + fixed_duty_per_piece',
    example:
      'HTS 3924.10.4000 (Plastic Tableware) -> 3.4% duty rate applied to FOB price.'
  },
  tariff_parameters: {
    title: 'Geopolitical Trade Tariffs (Section 301)',
    parameterKey: 'tariff_parameters',
    cardinality: 'multiple',
    purpose:
      'Special trade remedies, retaliatory tariffs, and Section 301 tariffs enforced by national governments on goods originating from specific trading partners.',
    validityRules:
      'Multiple concurrent active tariffs allowed (N Active). Tariffs vary by origin country, regulatory annex list (e.g., List 3, List 4A), and effective calendar window.',
    calculationImpact:
      'Adds an incremental tariff cost on top of statutory HTS customs duties, calculated as a percentage of the FOB price for affected origin countries.',
    formula: 'Tariff Cost = FOB * tariff_percentage',
    example:
      'Origin = China on Section 301 List 3 -> +25.0% additional landed tariff cost.'
  },
  ocean_freight: {
    title: 'Ocean Freight Carrier Rates',
    parameterKey: 'ocean_freight',
    cardinality: 'single_deprecating',
    purpose:
      'Contracted carrier rates and maritime shipping spot prices per ocean container (20STD, 40STD, 40HC, 45HC) across commercial shipping lanes.',
    validityRules:
      'Single active rate per Port-Pair lane. When a new rate contract is created for the same departure/arrival lane, the previous rate is automatically deprecated (only 1 currently active rate per lane).',
    calculationImpact:
      'Amortized per unit using 3D container packing algorithms (optimal pieces per container based on carton volume vs container weight limit).',
    formula:
      'Ocean Freight per Piece = Contract Rate / Optimal Pieces per Container (40HC)',
    example:
      '$3,850 lane rate / 12,000 optimal pieces = $0.3208 ocean freight cost per unit.'
  },
  inland_parameter: {
    title: 'Origin Inland Transportation',
    parameterKey: 'inland_parameter',
    cardinality: 'single_deprecating',
    purpose:
      'First-mile inland drayage, trucking, and intermodal transport from overseas manufacturing facilities to the departure seaport terminal.',
    validityRules:
      'Single active rate per factory origin zone. Publishing a new inland rate schedule deprecates prior contracts for that origin corridor.',
    calculationImpact:
      'Allocated into pre-clearance logistics, amortized per carton/piece depending on factory dispatch packaging.',
    formula:
      'Inland Drayage per Piece = Inland Truckload Rate / Total Units per Shipment',
    example:
      'RMB 2,500 / 7.20 FX = $347.22 / 5,000 units = $0.0694 inland freight per unit.'
  },
  ground_freight: {
    title: 'Domestic Destination Ground Freight',
    parameterKey: 'ground_freight',
    cardinality: 'single_deprecating',
    purpose:
      'Domestic linehaul trucking and distribution transport from the seaport of arrival to regional fulfillment warehouses via 53FT domestic dry vans.',
    validityRules:
      'Single active rate per domestic delivery lane. Newly negotiated carrier agreements deprecate prior contract line items.',
    calculationImpact:
      'Divided across the total capacity of a 53FT dry van trailer, optimized according to master carton volume and weight limits.',
    formula:
      'Ground Freight per Piece = 53FT Linehaul Rate / Optimal Pieces per 53FT',
    example:
      '$2,400 linehaul / 14,500 pieces = $0.1655 ground delivery cost per unit.'
  },
  port_cost: {
    title: 'Port Handling & Terminal Charges',
    parameterKey: 'port_cost',
    cardinality: 'single_deprecating',
    purpose:
      'Terminal handling charges (THC), wharfage fees, customs clearance documentation, clean truck fees, and harbor maintenance assessments.',
    validityRules:
      'Single active rate schedule per destination port. Updates deprecate historical tariff fee schedules for that port facility.',
    calculationImpact:
      'Allocated per container arrival and divided across total pieces to establish net terminal handling cost per piece.',
    formula:
      'Port Handling per Piece = Total Terminal Charges / Pieces per Container',
    example:
      '$650 port THC / 12,000 pieces in 40HC = $0.0542 terminal cost per unit.'
  },
  vendor_ports: {
    title: 'Vendor Port Dispatch Routing',
    parameterKey: 'vendor_ports',
    cardinality: 'single_deprecating',
    purpose:
      'Default logistics routing linking overseas manufacturers and vendor facilities to their designated FOB departure seaport.',
    validityRules:
      'Single primary departure port per vendor. Reassigning a vendor to a different seaport deprecates the previous routing record.',
    calculationImpact:
      'Automatically selects the appropriate Ocean Freight origin and lane contract during bulk calculation engine runs.',
    formula: 'Vendor -> Default Seaport -> Matching Ocean Freight Lane Contract'
  },
  incoterm_cost_group: {
    title: 'Incoterm Cost Allocation Rules',
    parameterKey: 'incoterm_cost_group',
    cardinality: 'multiple',
    purpose:
      'Defines commercial cost liability boundaries according to ICC Incoterms 2020 rules (FOB, EXW, CNF, DDP).',
    validityRules:
      'Multiple active rules defining standard incoterm cost structures across different vendor purchasing agreements.',
    calculationImpact:
      'Determines which freight and duty components are included in the baseline supplier price vs added to buyer landed cost.',
    formula:
      'Landed Cost = FOB + Ocean + Ground + Port + HTS Duty + Section 301 Tariff'
  },
  duties_commercial_agreements: {
    title: 'Preferential Trade Agreements (FTAs)',
    parameterKey: 'duties_commercial_agreements',
    cardinality: 'multiple',
    purpose:
      'Bilateral and multilateral free trade agreements (USMCA, CAFTA-DR, GSP) that exempt or reduce customs duties for qualifying country origins.',
    validityRules:
      'Multiple concurrent active agreements mapped to country of origin and qualifying HTS commodity categories.',
    calculationImpact:
      'Overrides statutory HTS default duty with preferential negotiated rate (often reducing tariff to 0.0%).',
    formula:
      'Duty Cost = FOB * Preferential Duty Rate (overrides default HTS rate)',
    example: 'Origin = Mexico under USMCA -> 0% duty on qualifying goods.'
  },
  tariff_hts_exceptions: {
    title: 'Tariff Exclusions & HTS Exceptions',
    parameterKey: 'tariff_hts_exceptions',
    cardinality: 'multiple',
    purpose:
      'Specific regulatory exclusions granted by trade agencies (e.g. USTR Section 301 exclusions) for specialized product sub-categories.',
    validityRules:
      'Multiple active exemptions bounded by 10-digit HTS code and official governmental expiration date.',
    calculationImpact:
      'Exempts qualifying SKUs from punitive Section 301 tariffs, calculating net tariff as 0% for valid periods.',
    formula: 'Effective Tariff Rate = 0.0% (during active exemption window)'
  },
  other_parameters: {
    title: 'Global Business & Economic Parameters',
    parameterKey: 'other_parameters',
    cardinality: 'single_deprecating',
    purpose:
      'Macroeconomic and financial parameters including currency exchange rates, target retail MSRP margin multipliers, and sales commission rates.',
    validityRules:
      'Single active global configuration profile. New revisions deprecate the historical configuration set.',
    calculationImpact:
      'Governs financial formulas for Target MSRP, sales commission percentages, and foreign currency conversions.',
    formula:
      'Commission = FOB * commission_percentage; MSRP = Estimated Landed Cost * Markup Multiplier'
  }
};
