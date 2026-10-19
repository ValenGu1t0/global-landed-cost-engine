import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import ProductListSkeleton from '@/features/products/components/product-list-skeleton';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import PortCostListPage from '@/features/parameters/port_cost/components/port-cost-list-page';
import PortCostActions from '@/features/parameters/port_cost/components/port-cost-actions';
import {
  portCostSearchParamsCache,
  serializePortCostParams
} from '@/features/parameters/port_cost/searchparams';
import { PortCostFilters } from '@/features/parameters/port_cost/components/port-cost-filters';

import { ParameterInfoBanner } from '@/components/parameters/parameter-info-banner';
import { PARAMETER_DOCS } from '@/constants/parameter-docs';

export const metadata = {
  title: 'Parameters: Port Cost'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  portCostSearchParamsCache.parse(searchParams);
  const key = serializePortCostParams({ ...searchParams });

  return (
    <PageContainer scrollable={false}>
      <div className='flex min-h-0 min-w-0 flex-1 flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <Heading title='Port Cost' description='Manage Port Costs' />
          <PortCostActions />
        </div>

        <Separator />

        <ParameterInfoBanner {...PARAMETER_DOCS.port_cost} />

        <Suspense fallback={<div className='h-9' />}>
          <PortCostFilters />
        </Suspense>

        <Suspense key={key} fallback={<ProductListSkeleton />}>
          <PortCostListPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
