import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { IncotermCostGroupActions } from '@/features/parameters/incoterm_cost_group/components/incoterm_cost_group-actions';
import { IncotermCostGroupFilters } from '@/features/parameters/incoterm_cost_group/components/incoterm_cost_group-filters';
import IncotermCostGroupListPage from '@/features/parameters/incoterm_cost_group/components/incoterm_cost_group-list-page';
import {
  incotermCostGroupSearchParamsCache,
  serializeIncotermCostGroupParams
} from '@/features/parameters/incoterm_cost_group/searchparams';
import ProductListSkeleton from '@/features/products/components/product-list-skeleton';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

import { ParameterInfoBanner } from '@/components/parameters/parameter-info-banner';
import { PARAMETER_DOCS } from '@/constants/parameter-docs';

export const metadata = {
  title: 'Parameters: Incoterm Cost Group'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  incotermCostGroupSearchParamsCache.parse(searchParams);
  const key = serializeIncotermCostGroupParams({ ...searchParams });

  return (
    <PageContainer scrollable={false}>
      <div className='flex min-h-0 min-w-0 flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between'>
          <Heading
            title='Incoterm Cost Groups'
            description='Manage Incoterm Cost Groups'
          />
          <IncotermCostGroupActions />
        </div>

        <Separator />

        <ParameterInfoBanner {...PARAMETER_DOCS.incoterm_cost_group} />

        <Suspense fallback={<div className='h-9' />}>
          <IncotermCostGroupFilters />
        </Suspense>

        <Suspense key={key} fallback={<ProductListSkeleton />}>
          <IncotermCostGroupListPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
