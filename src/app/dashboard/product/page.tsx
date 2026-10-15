import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { ProductActions } from '@/features/products/components/product-actions';
import { ProductFilters } from '@/features/products/components/product-filters';
import ProductListPage from '@/features/products/components/product-list-page';
import ProductListSkeleton from '@/features/products/components/product-list-skeleton';
import { productSearchParamsCache } from '@/features/products/searchparams';
import { serializeProductParams } from '@/features/products/searchparams';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Products'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  productSearchParamsCache.parse(searchParams);

  const key = serializeProductParams({ ...searchParams });

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading title='Products' description='Manage products' />
          <ProductActions />
        </div>
        <Separator />

        <Suspense fallback={<div className='h-9' />}>
          <ProductFilters />
        </Suspense>

        <Suspense key={key} fallback={<ProductListSkeleton />}>
          <ProductListPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
