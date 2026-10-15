import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import ProductListSkeleton from '@/features/products/components/product-list-skeleton';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

import TariffParametersListPage from '@/features/parameters/tariff_parameters/components/tariff-parameters-list-page';
import TariffParametersActions from '@/features/parameters/tariff_parameters/components/tariff-parameters-actions';
import {
  serializeTariffParametersParams,
  tariffParametersSearchParamsCache
} from '@/features/parameters/tariff_parameters/searchparams';
import { TariffParametersFilters } from '@/features/parameters/tariff_parameters/components/tariff-parameters-filters';

import { ParameterInfoBanner } from '@/components/parameters/parameter-info-banner';
import { PARAMETER_DOCS } from '@/constants/parameter-docs';

export const metadata = {
  title: 'Parameters: Tariff Parameters'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  tariffParametersSearchParamsCache.parse(searchParams);
  const key = serializeTariffParametersParams({ ...searchParams });

  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between'>
          <Heading
            title='Tariff Parameters'
            description='Manage Tariff Parameters'
          />
          <TariffParametersActions />
        </div>

        <Separator />

        <ParameterInfoBanner {...PARAMETER_DOCS.tariff_parameters} />

        <Suspense fallback={<div className='h-9' />}>
          <TariffParametersFilters />
        </Suspense>

        <Suspense key={key} fallback={<ProductListSkeleton />}>
          <TariffParametersListPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
