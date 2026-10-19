import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import ProductListSkeleton from '@/features/products/components/product-list-skeleton';
import { ProductsViewActions } from '@/features/products_view/components/products-view-actions';
import { ProductsViewFilters } from '@/features/products_view/components/products-view-filters';
import ProductsViewListPage from '@/features/products_view/components/products-view-list-page';
import {
  productsViewSearchParamsCache,
  serializeProductsViewParams
} from '@/features/products_view/searchparams';
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
  productsViewSearchParamsCache.parse(searchParams);
  const key = serializeProductsViewParams({ ...searchParams });

  return (
    <PageContainer scrollable={false}>
      <div className='flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-hidden'>
        <div className='flex shrink-0 items-start justify-between'>
          <Heading title='Products' description='Manage products' />
          <ProductsViewActions />
        </div>

        <Separator className='shrink-0' />

        <div className='flex min-w-0 shrink-0 flex-col gap-4'>
          <Suspense fallback={<div className='h-9' />}>
            <ProductsViewFilters />
          </Suspense>
        </div>

        <div className='min-h-0 min-w-0 flex-1 overflow-hidden'>
          <Suspense key={key} fallback={<ProductListSkeleton />}>
            <ProductsViewListPage />
          </Suspense>
        </div>
      </div>
    </PageContainer>
  );
}
