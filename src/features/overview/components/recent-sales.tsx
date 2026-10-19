import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Anchor,
  FileSpreadsheet,
  Landmark,
  Percent,
  Ship,
  Truck
} from 'lucide-react';

const parameterUpdates = [
  {
    parameter: 'Inland Freight (US-West Corridor)',
    detail: 'October — Drayage & diesel surcharge revision (LA → Dallas)',
    impact: '+0.5%',
    trend: 'up' as const,
    icon: Truck
  },
  {
    parameter: 'HTS 9403.20 — Section 301 Tariff',
    detail: 'October — Metal furniture & retail fixtures duty update',
    impact: '+2.5%',
    trend: 'up' as const,
    icon: Landmark
  },
  {
    parameter: 'Ocean Freight 40HC (Yantian → LB)',
    detail: 'October — Q4 carrier contract spot rate renegotiation',
    impact: '-4.2%',
    trend: 'down' as const,
    icon: Ship
  },
  {
    parameter: 'Harbour Maintenance Fee (HMF)',
    detail: 'September — US Customs port ad-valorem fee adjustment',
    impact: '+0.125%',
    trend: 'up' as const,
    icon: Anchor
  },
  {
    parameter: 'Receiving Warehouse (NJ Hub)',
    detail: 'September — Cross-dock palletization rate optimization',
    impact: '-$1.80/plt',
    trend: 'down' as const,
    icon: FileSpreadsheet
  },
  {
    parameter: 'FTA Commercial Agreement (MX–US)',
    detail: 'September — Nearshoring preferential tariff exemption',
    impact: '-5.0%',
    trend: 'down' as const,
    icon: Percent
  }
];

export function RecentSales() {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Recent Tax &amp; Cost Parameter Changes</CardTitle>
        <CardDescription>
          Latest tariff, duty, and freight revisions impacting landed unit cost.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-5'>
          {parameterUpdates.map((item, index) => {
            const Icon = item.icon;
            const isCostIncrease = item.trend === 'up';
            return (
              <div key={index} className='flex items-start gap-3'>
                <div className='bg-muted text-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border'>
                  <Icon className='h-4 w-4' />
                </div>
                <div className='min-w-0 flex-1 space-y-1'>
                  <p className='truncate text-sm leading-none font-medium'>
                    {item.parameter}
                  </p>
                  <p className='text-muted-foreground line-clamp-1 text-xs'>
                    {item.detail}
                  </p>
                </div>
                <Badge
                  variant={isCostIncrease ? 'destructive' : 'default'}
                  className='ml-auto shrink-0 font-mono text-xs'
                >
                  {item.impact}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
