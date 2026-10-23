'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Ship,
  Truck,
  Box,
  Calculator,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Ruler,
  ArrowRight,
  Factory
} from 'lucide-react';
import { ProductTable } from '@/db/schema';

type Props = {
  product: ProductTable;
};

export function ProductEconomicsCard({ product }: Props) {
  const p = product as any;

  // Formatter helpers
  const fmtCurrency = (val: number | string | null | undefined) => {
    if (val === null || val === undefined || isNaN(Number(val))) return '—';
    return `$${Number(val).toFixed(2)}`;
  };

  const fmtNum = (val: number | string | null | undefined, decimals = 0) => {
    if (val === null || val === undefined || isNaN(Number(val))) return '—';
    return Number(val).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  const fobVal = Number(p.fob ?? p.fob_current_cost_value ?? 0);
  const exwVal = Number(p.exw ?? p.exw_current_cost_value ?? 0);
  const cnfVal = Number(p.cnf ?? p.cnf_current_cost_value ?? 0);
  const cnfDiffVal = Number(p.cnf_diff ?? p.cnf_diff_current_cost_value ?? 0);
  const ddpVal = Number(p.ddp ?? p.ddp_current_cost_value ?? 0);

  const cbm =
    p.cbm ??
    p.case_cbm ??
    (p.carton_length_mm && p.carton_width_mm && p.carton_height_mm
      ? Number(
          (
            (p.carton_length_mm * p.carton_width_mm * p.carton_height_mm) /
            1_000_000_000
          ).toFixed(4)
        )
      : null);

  const cft =
    p.cft ?? p.case_cft ?? (cbm ? Number((cbm * 35.3147).toFixed(2)) : null);

  const incotermSteps = [
    {
      code: 'EXW',
      title: 'Ex Works (Factory Gate)',
      value: exwVal,
      subtitle: `${p.origin_country || 'Origin'} Factory Price`,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'border-amber-500/20 bg-amber-500/5'
    },
    {
      code: 'FOB',
      title: 'Free On Board (Origin Port)',
      value: fobVal,
      subtitle: 'Includes origin inland & port loading',
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'border-sky-500/20 bg-sky-500/5'
    },
    {
      code: 'CNF',
      title: 'Cost & Freight (Dest. Port)',
      value: cnfVal,
      subtitle: 'FOB + Ocean container freight',
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'border-indigo-500/20 bg-indigo-500/5'
    },
    {
      code: 'CNF Diff',
      title: 'Freight Differential',
      value: cnfDiffVal,
      prefix: '+',
      subtitle: 'Ocean freight + insurance spread',
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'border-purple-500/20 bg-purple-500/5'
    },
    {
      code: 'DDP',
      title: 'Delivered Duty Paid',
      value: ddpVal,
      subtitle: 'All-in customs, duties & inland delivery',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'border-emerald-500/20 bg-emerald-500/5'
    }
  ];

  const destinationCountries = [
    {
      country: 'USA',
      flag: '🇺🇸',
      port: 'NY / Savannah / LA',
      corridor: 'US East/West Coast + MFN/301 Duty',
      cost: p.landed_cost_usa,
      accent:
        'border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
    },
    {
      country: 'Canada',
      flag: '🇨🇦',
      port: 'Montreal / Vancouver',
      corridor: 'Ocean + CN Intermodal Rail + CBSA Duty',
      cost: p.landed_cost_canada,
      accent: 'border-sky-500/30 bg-sky-500/5 text-sky-600 dark:text-sky-400'
    },
    {
      country: 'France',
      flag: '🇫🇷',
      port: 'Le Havre / Marseille',
      corridor: 'EU Med/Atlantic + Common External Tariff',
      cost: p.landed_cost_france,
      accent:
        'border-indigo-500/30 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400'
    },
    {
      country: 'Morocco',
      flag: '🇲🇦',
      port: 'Tanger-Med / Casablanca',
      corridor: 'North Africa Atlantic + Import Duty',
      cost: p.landed_cost_morocco,
      accent:
        'border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400'
    },
    {
      country: 'Israel',
      flag: '🇮🇱',
      port: 'Haifa / Ashdod',
      corridor: 'East Med Corridor + SII & Customs Clearance',
      cost: p.landed_cost_israel,
      accent:
        'border-purple-500/30 bg-purple-500/5 text-purple-600 dark:text-purple-400'
    }
  ];

  const containerSpecs = [
    {
      type: "40' High Cube (40HC)",
      badge: 'Primary Ocean',
      capacityCBM: '68.0 CBM',
      calculatedVol: p.calculated_cartons_40hc_per_volume,
      optimalCartons: p.optimal_cartons_per_40hc,
      optimalPieces: p.optimal_pieces_per_40hc,
      confirmed: p.confirmed_carton_per_40hc
    },
    {
      type: "45' High Cube (45HC)",
      badge: 'High Volume',
      capacityCBM: '76.0 CBM',
      calculatedVol: p.calculated_cartons_45hc_per_volume,
      optimalCartons: p.optimal_cartons_per_45hc,
      optimalPieces: p.optimal_pieces_per_45hc,
      confirmed: p.confirmed_carton_per_45hc
    },
    {
      type: "40' Standard (40STD)",
      badge: 'Standard Ocean',
      capacityCBM: '58.0 CBM',
      calculatedVol: p.calculated_cartons_40std_per_volume,
      optimalCartons: p.optimal_cartons_per_40std,
      optimalPieces: p.optimal_pieces_per_40std,
      confirmed: p.confirmed_carton_per_40std
    },
    {
      type: "20' Standard (20STD)",
      badge: 'Small Batch',
      capacityCBM: '28.0 CBM',
      calculatedVol: p.calculated_cartons_20std_per_volume,
      optimalCartons: p.optimal_cartons_per_20std,
      optimalPieces: p.optimal_pieces_per_20std,
      confirmed: p.confirmed_carton_per_20std
    },
    {
      type: "53' Domestic Dry Van",
      badge: 'Domestic Linehaul',
      capacityCBM: '110.0 CBM',
      calculatedVol: p.calculated_cartons_53ft_per_volume,
      optimalCartons: p.optimal_cartons_per_53ft,
      optimalPieces: p.optimal_pieces_per_53ft,
      confirmed: p.confirmed_carton_per_53ft
    }
  ];

  return (
    <Card className='border-primary/20 from-card via-card to-primary/5 bg-gradient-to-br shadow-md'>
      <CardHeader className='pb-3'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <div className='bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg'>
              <Calculator className='h-5 w-5' />
            </div>
            <div>
              <CardTitle className='text-base font-bold tracking-tight'>
                ConnectAR Global Landed Cost & Incoterm Route Engine
              </CardTitle>
              <p className='text-muted-foreground text-xs'>
                Origin:{' '}
                <strong className='text-foreground'>
                  {p.origin_country || 'Global'}
                </strong>{' '}
                ({p.factory_name || p.vendor}) • SKU:{' '}
                {p.cn_code || `ID-${p.tech_sku_id}`}
              </p>
            </div>
          </div>

          <Badge
            variant='outline'
            className='border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
          >
            <CheckCircle2 className='mr-1 h-3.5 w-3.5' /> Multi-Country Engine
            Active
          </Badge>
        </div>
      </CardHeader>

      <CardContent className='space-y-6 pt-2'>
        {/* 1. 5 Base Incoterms Progression */}
        <div className='space-y-2.5'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1.5 text-xs font-semibold'>
              <Factory className='text-primary h-4 w-4' />
              <span>
                1. Base Incoterms Progression (From Origin Factory to Delivered)
              </span>
            </div>
            <span className='text-muted-foreground text-[11px]'>
              5 International Commercial Terms
            </span>
          </div>

          <div className='grid grid-cols-1 gap-2.5 sm:grid-cols-5'>
            {incotermSteps.map((step, idx) => (
              <div
                key={step.code}
                className={`relative rounded-lg border p-3 ${step.bg}`}
              >
                <div className='flex items-center justify-between'>
                  <Badge
                    variant='outline'
                    className='font-mono text-[10px] font-bold'
                  >
                    {idx + 1}. {step.code}
                  </Badge>
                  {idx < incotermSteps.length - 1 && (
                    <ArrowRight className='text-muted-foreground hidden h-3.5 w-3.5 sm:block' />
                  )}
                </div>
                <div
                  className={`mt-1.5 font-mono text-lg font-bold ${step.color}`}
                >
                  {step.prefix || ''}
                  {fmtCurrency(step.value)}
                </div>
                <div className='text-foreground text-[11px] font-medium'>
                  {step.title}
                </div>
                <div className='text-muted-foreground mt-0.5 text-[10px]'>
                  {step.subtitle}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Multi-Country Destination Landed Prices */}
        <div className='space-y-2.5'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1.5 text-xs font-semibold'>
              <Globe className='text-primary h-4 w-4' />
              <span>
                2. Destination Country Landed Prices (Route from{' '}
                {p.origin_country || 'Origin'})
              </span>
            </div>
            <span className='text-muted-foreground text-[11px]'>
              Includes ocean/rail freight corridor + local import duties &
              clearance
            </span>
          </div>

          <div className='grid grid-cols-1 gap-2.5 sm:grid-cols-5'>
            {destinationCountries.map((dest) => {
              const costNum = Number(dest.cost ?? 0);
              const deltaPct =
                fobVal > 0 && costNum > 0
                  ? Math.round(((costNum - fobVal) / fobVal) * 100)
                  : null;
              const deltaUsd =
                fobVal > 0 && costNum > 0
                  ? (costNum - fobVal).toFixed(2)
                  : null;

              return (
                <div
                  key={dest.country}
                  className='bg-muted/30 hover:bg-muted/50 rounded-lg border p-3 transition-colors'
                >
                  <div className='flex items-center justify-between'>
                    <span className='text-xs font-bold'>
                      {dest.flag} {dest.country}
                    </span>
                    {deltaPct !== null && (
                      <span
                        className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${dest.accent}`}
                      >
                        +{deltaPct}% vs FOB
                      </span>
                    )}
                  </div>
                  <div className='mt-1.5 font-mono text-xl font-bold'>
                    {fmtCurrency(dest.cost)}
                  </div>
                  {deltaUsd && (
                    <div className='text-muted-foreground font-mono text-[10px]'>
                      +${deltaUsd} freight & duty
                    </div>
                  )}
                  <div className='text-muted-foreground mt-1 border-t pt-1 text-[10px]'>
                    <strong className='text-foreground/80'>{dest.port}</strong>
                    <div className='truncate' title={dest.corridor}>
                      {dest.corridor}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Product Dimensions (cm & inches) + Economics KPIs */}
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
          {/* Product Dimensions (cm) */}
          <div className='bg-muted/40 rounded-lg border p-3'>
            <div className='text-muted-foreground flex items-center justify-between text-xs'>
              <span>Dimensions (cm)</span>
              <Ruler className='h-3.5 w-3.5' />
            </div>
            <div className='mt-1 font-mono text-sm font-bold'>
              {p.product_length_cm
                ? `${Number(p.product_length_cm).toFixed(1)} × ${Number(p.product_width_cm).toFixed(1)} × ${Number(p.product_height_cm).toFixed(1)} cm`
                : '—'}
            </div>
            <div className='text-muted-foreground text-[11px]'>
              L × W × H • Weight:{' '}
              {p.product_weight_kg
                ? `${Number(p.product_weight_kg).toFixed(2)} kg`
                : '—'}
            </div>
          </div>

          {/* Product Dimensions (inches) */}
          <div className='bg-muted/40 rounded-lg border p-3'>
            <div className='text-muted-foreground flex items-center justify-between text-xs'>
              <span>Dimensions (inches)</span>
              <Ruler className='h-3.5 w-3.5' />
            </div>
            <div className='mt-1 font-mono text-sm font-bold'>
              {p.product_length_in
                ? `${Number(p.product_length_in).toFixed(2)}" × ${Number(p.product_width_in).toFixed(2)}" × ${Number(p.product_height_in).toFixed(2)}"`
                : '—'}
            </div>
            <div className='text-muted-foreground text-[11px]'>
              L × W × H • Weight:{' '}
              {p.product_weight_lb
                ? `${Number(p.product_weight_lb).toFixed(2)} lb`
                : '—'}
            </div>
          </div>

          {/* Carton Volume */}
          <div className='bg-muted/40 rounded-lg border p-3'>
            <div className='text-muted-foreground flex items-center justify-between text-xs'>
              <span>Carton CBM / CFT</span>
              <Box className='h-3.5 w-3.5' />
            </div>
            <div className='mt-1 text-lg font-bold'>
              {cbm ? `${cbm} CBM` : '—'}
            </div>
            <div className='text-muted-foreground text-[11px]'>
              {cft ? `${cft} CFT` : '—'} | Pack: {p.pieces_per_carton ?? '—'}{' '}
              pcs
            </div>
          </div>

          {/* Target MSRP */}
          <div className='bg-muted/40 rounded-lg border p-3'>
            <div className='text-muted-foreground flex items-center justify-between text-xs'>
              <span>Target MSRP</span>
              <TrendingUp className='h-3.5 w-3.5' />
            </div>
            <div className='mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400'>
              {fmtCurrency(p.mrsp)}
            </div>
            <div className='text-muted-foreground text-[11px]'>
              HTS Duty: {fmtCurrency(p.duty_cost)} ({p.duty_percentage ?? 0}%)
            </div>
          </div>
        </div>

        {/* 4. Container Optimization Table */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1.5 text-xs font-semibold'>
              <Ship className='text-primary h-4 w-4' />
              <span>
                3. Multi-Modal Container Load Matrix (3D Volumetric vs Weight
                Yield)
              </span>
            </div>
            <span className='text-muted-foreground text-[11px]'>
              Max carton weight cap:{' '}
              {p.max_carton_per_weight
                ? `${fmtNum(p.max_carton_per_weight)} ctns`
                : 'Standard'}
            </span>
          </div>

          <div className='overflow-x-auto rounded-lg border'>
            <table className='w-full text-left text-xs'>
              <thead className='bg-muted/70 text-muted-foreground border-b text-[11px] font-semibold uppercase'>
                <tr>
                  <th className='p-2.5'>Container Mode</th>
                  <th className='p-2.5'>Nominal Volume</th>
                  <th className='p-2.5'>Volumetric Yield</th>
                  <th className='p-2.5'>Optimal Cartons</th>
                  <th className='p-2.5'>Optimal Units (Pcs)</th>
                  <th className='p-2.5'>Confirmed</th>
                </tr>
              </thead>
              <tbody className='divide-border/50 divide-y'>
                {containerSpecs.map((c, i) => (
                  <tr key={i} className='hover:bg-muted/30 transition-colors'>
                    <td className='p-2.5 font-medium'>
                      <div className='flex items-center gap-1.5'>
                        {c.type.includes('53') ? (
                          <Truck className='text-muted-foreground h-3.5 w-3.5' />
                        ) : (
                          <Ship className='text-muted-foreground h-3.5 w-3.5' />
                        )}
                        <span>{c.type}</span>
                        <Badge
                          variant='outline'
                          className='px-1 py-0 text-[9px]'
                        >
                          {c.badge}
                        </Badge>
                      </div>
                    </td>
                    <td className='text-muted-foreground p-2.5'>
                      {c.capacityCBM}
                    </td>
                    <td className='p-2.5 font-mono text-[11px]'>
                      {fmtNum(c.calculatedVol)} ctns
                    </td>
                    <td className='p-2.5 font-mono font-bold text-emerald-600 dark:text-emerald-400'>
                      {fmtNum(c.optimalCartons)} ctns
                    </td>
                    <td className='p-2.5 font-mono font-bold'>
                      {fmtNum(c.optimalPieces)} pcs
                    </td>
                    <td className='p-2.5 font-mono text-slate-500'>
                      {c.confirmed ? `${fmtNum(c.confirmed)} ctns` : 'Auto'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
