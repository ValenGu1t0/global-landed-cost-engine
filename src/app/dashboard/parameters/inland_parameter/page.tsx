import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import ProductListSkeleton from '@/features/products/components/product-list-skeleton';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import InlandParameterActions from '@/features/parameters/inland_parameter/components/inland-parameter-actions';
import InlandParameterListPage from '@/features/parameters/inland_parameter/components/inland-parameter-list-page';
import { InlandParameterFilters } from '@/features/parameters/inland_parameter/components/inland-parameter-filter';
import {
  inlandParameterSearchParamsCache,
  serializeInlandParameterParams
} from '@/features/parameters/inland_parameter/searchparams';

import { ParameterInfoBanner } from '@/components/parameters/parameter-info-banner';
import { PARAMETER_DOCS } from '@/constants/parameter-docs';

export const metadata = {
  title: 'Parameters: Inland Parameters'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  inlandParameterSearchParamsCache.parse(searchParams);
  const key = serializeInlandParameterParams({ ...searchParams });

  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between'>
          <Heading
            title='Inland Parameter'
            description='Manage Inland Parameters'
          />
          <InlandParameterActions />
        </div>

        <Separator />

        <ParameterInfoBanner {...PARAMETER_DOCS.inland_parameter} />

        <Suspense fallback={<div className='h-9' />}>
          <InlandParameterFilters />
        </Suspense>

        <Suspense key={key} fallback={<ProductListSkeleton />}>
          <InlandParameterListPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
