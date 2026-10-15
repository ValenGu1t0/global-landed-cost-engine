import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import ProductListSkeleton from '@/features/products/components/product-list-skeleton';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import GroundFreightListPage from '@/features/parameters/ground_freight/components/ground-freight-list-page';
import GroundFreightActions from '@/features/parameters/ground_freight/components/ground-freight-actions';
import {
  groundFreightSearchParamsCache,
  serializeGroundFreightParams
} from '@/features/parameters/ground_freight/searchparams';
import { GroundFreightFilters } from '@/features/parameters/ground_freight/components/ground-freight-filters';

import { ParameterInfoBanner } from '@/components/parameters/parameter-info-banner';
import { PARAMETER_DOCS } from '@/constants/parameter-docs';

export const metadata = {
  title: 'Parameters: Ground Freight'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  groundFreightSearchParamsCache.parse(searchParams);

  const key = serializeGroundFreightParams({ ...searchParams });

  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between'>
          <Heading
            title='Ground Freight Parameter'
            description='Manage Ground Freight Parameters'
          />
          <GroundFreightActions />
        </div>

        <Separator />

        <ParameterInfoBanner {...PARAMETER_DOCS.ground_freight} />

        <Suspense fallback={<div className='h-9' />}>
          <GroundFreightFilters />
        </Suspense>

        <Suspense key={key} fallback={<ProductListSkeleton />}>
          <GroundFreightListPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
