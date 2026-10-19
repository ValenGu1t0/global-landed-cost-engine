'use client';

import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { navItems } from '@/constants/data';
import { Icons } from '@/components/icons';
import PageContainer from '@/components/layout/page-container';
import { PARAMETER_DOCS } from '@/constants/parameter-docs';
import { ArrowRight, History, Layers } from 'lucide-react';

export default function ParametersPage() {
  const parametersItem = navItems.find((item) => item.title === 'Parameters');
  const parameterSubItems = (parametersItem?.items ?? []).filter(
    (item) =>
      item.title !== 'All Parameters' && item.url !== '/dashboard/parameters'
  );

  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-6'>
        {/* Header */}
        <div className='flex items-start justify-between'>
          <Heading
            title='Global Trade & Landed Cost Parameters'
            description='Enterprise parameters governing tariffs, freight contracts, terminal fees, and multi-variable landed cost calculations.'
          />
        </div>

        <Separator />

        {/* Executive Summary Card */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <Card className='border-emerald-500/20 bg-emerald-500/5'>
            <CardHeader className='pb-2'>
              <div className='flex items-center gap-2'>
                <Badge variant='default' className='text-xs'>
                  <Layers className='mr-1 h-3 w-3' /> Multiple Concurrent (N
                  Active)
                </Badge>
              </div>
              <CardTitle className='text-base font-semibold'>
                Commodity & Regulatory Classifications
              </CardTitle>
            </CardHeader>
            <CardContent className='text-muted-foreground text-xs leading-relaxed'>
              Parameters like <strong>HTS Codes</strong>,{' '}
              <strong>Section 301 Tariffs</strong>, and{' '}
              <strong>Trade Agreements</strong> allow multiple active records.
              Each product SKU maps to its specific tariff line item and
              exemption rules concurrently based on its material and origin.
            </CardContent>
          </Card>

          <Card className='border-amber-500/20 bg-amber-500/5'>
            <CardHeader className='pb-2'>
              <div className='flex items-center gap-2'>
                <Badge variant='warning' className='text-xs'>
                  <History className='mr-1 h-3 w-3' /> Single Active (Deprecates
                  Previous)
                </Badge>
              </div>
              <CardTitle className='text-base font-semibold'>
                Carrier Contracts & Logistics Rates
              </CardTitle>
            </CardHeader>
            <CardContent className='text-muted-foreground text-xs leading-relaxed'>
              Parameters like <strong>Ocean Freight Lanes</strong>,{' '}
              <strong>Ground Freight</strong>, and <strong>Port Costs</strong>{' '}
              maintain exactly one valid active rate per route/lane. When a new
              contract is entered, the prior rate is automatically deprecated to
              preserve historical auditability.
            </CardContent>
          </Card>
        </div>

        {/* Grid de Cards */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {parameterSubItems.map((item, idx) => {
            const Icon =
              Icons[item.icon as keyof typeof Icons] ?? Icons.dashboard;
            const paramKey = item.url.split('/').pop() || '';
            const doc = PARAMETER_DOCS[paramKey];

            return (
              <Card
                key={idx}
                className='group flex flex-col justify-between transition-shadow duration-300 hover:shadow-lg'
              >
                <div>
                  <CardHeader className='flex flex-row items-start gap-4 pb-3'>
                    <div className='bg-muted group-hover:bg-primary/10 rounded-full p-3 transition-colors'>
                      <Icon className='text-muted-foreground group-hover:text-primary h-6 w-6' />
                    </div>
                    <div className='flex-1'>
                      <CardTitle className='text-base font-semibold'>
                        {item.title}
                      </CardTitle>
                      {doc && (
                        <div className='mt-1.5'>
                          <Badge
                            variant={
                              doc.cardinality === 'single_deprecating'
                                ? 'warning'
                                : 'default'
                            }
                            className='text-[10px] font-medium'
                          >
                            {doc.cardinality === 'single_deprecating'
                              ? 'Single Active'
                              : 'Multiple Active'}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className='text-muted-foreground text-xs leading-relaxed'>
                    {doc ? doc.purpose : item.shortcut?.join(' + ')}
                  </CardContent>
                </div>

                <CardFooter className='border-border/40 border-t pt-3'>
                  <Link
                    href={item.url}
                    className='text-primary group-hover:text-primary/80 inline-flex items-center text-xs font-semibold'
                  >
                    Open {item.title}
                    <ArrowRight className='ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1' />
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}
