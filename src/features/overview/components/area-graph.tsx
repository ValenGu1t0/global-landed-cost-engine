'use client';

import { IconTrendingUp } from '@tabler/icons-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

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
  { month: 'May', fob: 18.4, duty_freight: 6.8 },
  { month: 'June', fob: 18.2, duty_freight: 7.1 },
  { month: 'July', fob: 18.5, duty_freight: 6.9 },
  { month: 'August', fob: 18.1, duty_freight: 7.4 },
  { month: 'September', fob: 17.9, duty_freight: 6.6 },
  { month: 'October', fob: 17.8, duty_freight: 6.4 }
];

const chartConfig = {
  landed: {
    label: 'Avg. Unit Cost ($ USD)'
  },
  fob: {
    label: 'FOB Factory Cost ($)',
    color: 'var(--primary)'
  },
  duty_freight: {
    label: 'Duties + Freight ($)',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

export function AreaGraph() {
  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Landed Cost Structure Evolution (USD / Unit)</CardTitle>
        <CardDescription>
          Stacked comparison of average FOB factory cost vs. duties &amp;
          multi-modal freight overhead
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <defs>
              <linearGradient id='fillDesktop' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-fob)'
                  stopOpacity={1.0}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-fob)'
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id='fillMobile' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-duty_freight)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-duty_freight)'
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dot' />}
            />
            <Area
              dataKey='duty_freight'
              type='natural'
              fill='url(#fillMobile)'
              stroke='var(--color-duty_freight)'
              stackId='a'
            />
            <Area
              dataKey='fob'
              type='natural'
              fill='url(#fillDesktop)'
              stroke='var(--color-fob)'
              stackId='a'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none font-medium'>
              Ocean freight stabilization reduced landed overhead by 1.8% in
              October <IconTrendingUp className='h-4 w-4' />
            </div>
            <div className='text-muted-foreground flex items-center gap-2 leading-none'>
              May – October 2026 (Weighted SKU Catalog Average)
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
