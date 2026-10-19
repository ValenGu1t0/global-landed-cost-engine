import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import ProductListSkeleton from '@/features/products/components/product-list-skeleton';
import { ActivateStatusActions } from '@/features/status/activate/components/activate-actions';
import { ActivateStatusFilters } from '@/features/status/activate/components/activate-filters';
import ActivateStatusPage from '@/features/status/activate/components/activate-list-page';
import {
  activateStatusSearchParamsCache,
  serializeActivateStatusParams
} from '@/features/status/activate/searchparams';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

export const metadata = {
  title: 'Activate Bulk Product Status'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  activateStatusSearchParamsCache.parse(searchParams);
  const key = serializeActivateStatusParams(
    activateStatusSearchParamsCache.all()
  );

  return (
    <PageContainer scrollable={false}>
      <div className='flex min-h-0 min-w-0 flex-1 flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <Heading
            title='Bulk Status Activation'
            description='Activate products in bulk'
          />
          <ActivateStatusActions />
        </div>

        <Separator />

        <Suspense fallback={<div className='h-9' />}>
          <ActivateStatusFilters />
        </Suspense>

        <Suspense key={key} fallback={<ProductListSkeleton />}>
          <ActivateStatusPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
