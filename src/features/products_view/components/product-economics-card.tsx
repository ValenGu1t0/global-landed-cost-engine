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
  CheckCircle2
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

  const cbm =
    p.cbm ??
    (p.carton_length_mm && p.carton_width_mm && p.carton_height_mm
      ? Number(
          (
            (p.carton_length_mm * p.carton_width_mm * p.carton_height_mm) /
            1_000_000_000
          ).toFixed(4)
        )
      : null);

  const cft = p.cft ?? (cbm ? Number((cbm * 35.3147).toFixed(2)) : null);

  const containerSpecs = [
    {
      type: "40' High Cube (40HC)",
      badge: 'Primary Ocean',
      capacityCBM: '76.0 CBM',
      calculatedVol: p.calculated_cartons_40hc_per_volume,
      optimalCartons: p.optimal_cartons_per_40hc,
      optimalPieces: p.optimal_pieces_per_40hc,
      confirmed: p.confirmed_carton_per_40hc
    },
    {
      type: "45' High Cube (45HC)",
      badge: 'High Volume',
      capacityCBM: '86.0 CBM',
      calculatedVol: p.calculated_cartons_45hc_per_volume,
      optimalCartons: p.optimal_cartons_per_45hc,
      optimalPieces: p.optimal_pieces_per_45hc,
      confirmed: p.confirmed_carton_per_45hc
    },
    {
      type: "40' Standard (40STD)",
      badge: 'Standard Ocean',
      capacityCBM: '67.0 CBM',
      calculatedVol: p.calculated_cartons_40std_per_volume,
      optimalCartons: p.optimal_cartons_per_40std,
      optimalPieces: p.optimal_pieces_per_40std,
      confirmed: p.confirmed_carton_per_40std
    },
    {
      type: "20' Standard (20STD)",
      badge: 'Small Batch',
      capacityCBM: '33.0 CBM',
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
                Landed Cost & Container Optimization Engine
              </CardTitle>
              <p className='text-muted-foreground text-xs'>
                Automated multi-modal freight yield and tariff allocation for
                SKU: {p.cn_code || `ID-${p.tech_sku_id}`}
              </p>
            </div>
          </div>

          <Badge
            variant='outline'
            className='border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
          >
            <CheckCircle2 className='mr-1 h-3.5 w-3.5' /> Engine Active
          </Badge>
        </div>
      </CardHeader>

      <CardContent className='space-y-6 pt-2'>
        {/* KPI Row */}
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
          {/* FOB Base */}
          <div className='bg-muted/40 rounded-lg border p-3'>
            <div className='text-muted-foreground flex items-center justify-between text-xs'>
              <span>FOB Price</span>
              <DollarSign className='h-3.5 w-3.5' />
            </div>
            <div className='mt-1 text-lg font-bold'>{fmtCurrency(p.fob)}</div>
            <div className='text-muted-foreground text-[11px]'>
              Supplier baseline
            </div>
          </div>

          {/* HTS Duty */}
          <div className='bg-muted/40 rounded-lg border p-3'>
            <div className='text-muted-foreground flex items-center justify-between text-xs'>
              <span>HTS Duty</span>
              <ShieldCheck className='h-3.5 w-3.5' />
            </div>
            <div className='mt-1 text-lg font-bold text-amber-600 dark:text-amber-400'>
              {fmtCurrency(p.duty_cost)}
            </div>
            <div className='text-muted-foreground text-[11px]'>
              Rate: {p.duty_percentage ? `${p.duty_percentage}%` : '0%'}
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
              Comm:{' '}
              {p.commission_percentage ? `${p.commission_percentage}%` : '0%'}
            </div>
          </div>
        </div>

        {/* Container Optimization Table */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1.5 text-xs font-semibold'>
              <Ship className='text-primary h-4 w-4' />
              <span>
                Multi-Modal Container Load Matrix (3D Volumetric vs Weight
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
