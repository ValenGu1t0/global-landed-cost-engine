import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { HTSActions } from '@/features/parameters/HTS/components/hts-actions';
import { HTSFilters } from '@/features/parameters/HTS/components/hts-filters';
import HTSListPage from '@/features/parameters/HTS/components/hts-list-page';
import {
  htsSearchParamsCache,
  serializeHTSParams
} from '@/features/parameters/HTS/searchparams';
import ProductListSkeleton from '@/features/products/components/product-list-skeleton';
import { ParameterInfoBanner } from '@/components/parameters/parameter-info-banner';
import { PARAMETER_DOCS } from '@/constants/parameter-docs';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

export const metadata = {
  title: 'Parameters: HTS Code'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  htsSearchParamsCache.parse(searchParams);
  const key = serializeHTSParams({ ...searchParams });

  return (
    <PageContainer scrollable={false}>
      <div className='flex min-h-0 min-w-0 flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between'>
          <Heading title='HTS Codes' description='Manage HTS Codes' />
          <HTSActions />
        </div>

        <Separator />

        <ParameterInfoBanner {...PARAMETER_DOCS.HTS} />

        <Suspense fallback={<div className='h-9' />}>
          <HTSFilters />
        </Suspense>

        {/* TABLA HTS */}
        <Suspense key={key} fallback={<ProductListSkeleton />}>
          <HTSListPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
