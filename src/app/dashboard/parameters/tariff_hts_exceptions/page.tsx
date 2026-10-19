import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import ProductListSkeleton from '@/features/products/components/product-list-skeleton';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import TariffHTSExceptionsListPage from '@/features/parameters/tariff_hts_exceptions/components/tariff-hts-exceptions-list-page';
import TariffHTSExceptionsActions from '@/features/parameters/tariff_hts_exceptions/components/tariff-hts-exceptions-actions';
import {
  serializeTariffHTSExceptionsParams,
  tariffHTSExceptionsSearchParamsCache
} from '@/features/parameters/tariff_hts_exceptions/searchparams';
import { TariffHTSExceptionsFilters } from '@/features/parameters/tariff_hts_exceptions/components/tariff-hts-exceptions-filters';

import { ParameterInfoBanner } from '@/components/parameters/parameter-info-banner';
import { PARAMETER_DOCS } from '@/constants/parameter-docs';

export const metadata = {
  title: 'Parameters: Tariff HTS Exceptions'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  tariffHTSExceptionsSearchParamsCache.parse(searchParams);
  const key = serializeTariffHTSExceptionsParams({ ...searchParams });

  return (
    <PageContainer scrollable={false}>
      <div className='flex min-h-0 min-w-0 flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between'>
          <Heading
            title='Tariff HTS Exceptions'
            description='Manage Tariff HTS Exceptions'
          />
          <TariffHTSExceptionsActions />
        </div>

        <Separator />

        <ParameterInfoBanner {...PARAMETER_DOCS.tariff_hts_exceptions} />

        <Suspense fallback={<div className='h-9' />}>
          <TariffHTSExceptionsFilters />
        </Suspense>

        <Suspense key={key} fallback={<ProductListSkeleton />}>
          <TariffHTSExceptionsListPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
