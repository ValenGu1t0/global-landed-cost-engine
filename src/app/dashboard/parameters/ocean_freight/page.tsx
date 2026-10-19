import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import ProductListSkeleton from '@/features/products/components/product-list-skeleton';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import OceanFreightParameterActions from '@/features/parameters/ocean_freight/components/ocean-freight-actions';
import OceanFreightListPage from '@/features/parameters/ocean_freight/components/ocean-freight-list-page';
import { OceanFreightFilters } from '@/features/parameters/ocean_freight/components/ocean-freight-filters';
import {
  oceanFreightSearchParamsCache,
  serializeOceanFreightParams
} from '@/features/parameters/ocean_freight/searchparams';

import { ParameterInfoBanner } from '@/components/parameters/parameter-info-banner';
import { PARAMETER_DOCS } from '@/constants/parameter-docs';

export const metadata = {
  title: 'Parameters: Ocean Freight'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  oceanFreightSearchParamsCache.parse(searchParams);

  const key = serializeOceanFreightParams({ ...searchParams });

  return (
    <PageContainer scrollable={false}>
      <div className='flex min-h-0 min-w-0 flex-1 flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <Heading
            title='Ocean Freight Parameter'
            description='Manage Ocean Freight Parameters'
          />
          <OceanFreightParameterActions />
        </div>

        <Separator />

        <ParameterInfoBanner {...PARAMETER_DOCS.ocean_freight} />

        <Suspense fallback={<div className='h-9' />}>
          <OceanFreightFilters />
        </Suspense>

        <Suspense key={key} fallback={<ProductListSkeleton />}>
          <OceanFreightListPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
