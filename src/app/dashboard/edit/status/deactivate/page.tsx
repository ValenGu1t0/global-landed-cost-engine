import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import ProductListSkeleton from '@/features/products/components/product-list-skeleton';
import { DeactivateStatusActions } from '@/features/status/deactivate/components/deactivate-actions';
import { DeactivateStatusFilters } from '@/features/status/deactivate/components/deactivate-filters';
import DeactivateStatusPage from '@/features/status/deactivate/components/deactivate-list-page';
import {
  deactivateStatusSearchParamsCache,
  serializeDeactivateStatusParams
} from '@/features/status/deactivate/searchparams';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

export const metadata = {
  title: 'Deactivate Bulk Product Status'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  deactivateStatusSearchParamsCache.parse(searchParams);
  const key = serializeDeactivateStatusParams({ ...searchParams });

  return (
    <PageContainer scrollable={false}>
      <div className='flex min-h-0 min-w-0 flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between'>
          <Heading
            title='Bulk Status Deactivation'
            description='Deactivate products in bulk'
          />
          <DeactivateStatusActions />
        </div>

        <Separator />

        <Suspense fallback={<div className='h-9' />}>
          <DeactivateStatusFilters />
        </Suspense>

        <Suspense key={key} fallback={<ProductListSkeleton />}>
          <DeactivateStatusPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
