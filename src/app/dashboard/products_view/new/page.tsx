import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductNewSkeleton from '@/features/products/components/product-new-skeleton';
import ProductViewNewPage from '@/features/products_view/components/products-view-new-page';

export const metadata = {
  title: 'Dashboard: New Product'
};

export default async function Page() {
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<ProductNewSkeleton />}>
          <ProductViewNewPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
