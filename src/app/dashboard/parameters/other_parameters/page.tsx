import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { OtherParameterActions } from '@/features/parameters/other_parameters/components/other_parameter-actions';
import { OtherParametersFilters } from '@/features/parameters/other_parameters/components/other_parameter-filters';
import OtherParametersListPage from '@/features/parameters/other_parameters/components/other_parameter-list-page';
import {
  otherParameterSearchParamsCache,
  serializeOtherParameterParams
} from '@/features/parameters/other_parameters/searchparams';
import ProductListSkeleton from '@/features/products/components/product-list-skeleton';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

import { ParameterInfoBanner } from '@/components/parameters/parameter-info-banner';
import { PARAMETER_DOCS } from '@/constants/parameter-docs';

export const metadata = {
  title: 'Parameters: Other Parameters'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  otherParameterSearchParamsCache.parse(searchParams);
  const key = serializeOtherParameterParams({ ...searchParams });

  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between'>
          <Heading
            title='Other Parameters'
            description='Manage Other Parameters'
          />
          <OtherParameterActions />
        </div>

        <Separator />

        <ParameterInfoBanner {...PARAMETER_DOCS.other_parameters} />

        <Suspense fallback={<div className='h-9' />}>
          <OtherParametersFilters />
        </Suspense>

        {/* TABLA Parameters */}
        <Suspense key={key} fallback={<ProductListSkeleton />}>
          <OtherParametersListPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
