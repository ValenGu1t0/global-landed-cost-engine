'use client';

import * as React from 'react';
import { IconTrendingUp } from '@tabler/icons-react';
import { Label, Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

const chartData = [
  { market: 'usa', units: 6420, fill: 'var(--primary)' },
  { market: 'canada', units: 3180, fill: 'var(--primary-light)' },
  { market: 'uk', units: 2240, fill: 'var(--primary-lighter)' },
  { market: 'germany', units: 1690, fill: 'var(--primary-dark)' },
  { market: 'latam', units: 1290, fill: 'var(--primary-darker)' }
];

const chartConfig = {
  units: {
    label: 'Shipped Units'
  },
  usa: {
    label: 'United States (43.3%)',
    color: 'var(--primary)'
  },
  canada: {
    label: 'Canada (21.5%)',
    color: 'var(--primary)'
  },
  uk: {
    label: 'United Kingdom (15.1%)',
    color: 'var(--primary)'
  },
  germany: {
    label: 'Germany (11.4%)',
    color: 'var(--primary)'
  },
  latam: {
    label: 'Mexico & LATAM (8.7%)',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

export function PieGraph() {
  const totalUnits = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.units, 0);
  }, []);

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Top Retailer Consumer Countries</CardTitle>
        <CardDescription>
          <span className='hidden @[540px]/card:block'>
            Shipped product volume distribution by destination retail market
          </span>
          <span className='@[540px]/card:hidden'>
            Retailer demand by country
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square h-[250px]'
        >
          <PieChart>
            <defs>
              {['usa', 'canada', 'uk', 'germany', 'latam'].map(
                (market, index) => (
                  <linearGradient
                    key={market}
                    id={`fill${market}`}
                    x1='0'
                    y1='0'
                    x2='0'
                    y2='1'
                  >
                    <stop
                      offset='0%'
                      stopColor='var(--primary)'
                      stopOpacity={1 - index * 0.15}
                    />
                    <stop
                      offset='100%'
                      stopColor='var(--primary)'
                      stopOpacity={0.8 - index * 0.15}
                    />
                  </linearGradient>
                )
              )}
            </defs>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData.map((item) => ({
                ...item,
                fill: `url(#fill${item.market})`
              }))}
              dataKey='units'
              nameKey='market'
              innerRadius={60}
              strokeWidth={2}
              stroke='var(--background)'
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalUnits.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground text-sm'
                        >
                          Shipped Units
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          United States leads with{' '}
          {((chartData[0].units / totalUnits) * 100).toFixed(1)}% of volume{' '}
          <IconTrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Consolidated across active retail distribution hubs (May – Oct 2026)
        </div>
      </CardFooter>
    </Card>
  );
}
