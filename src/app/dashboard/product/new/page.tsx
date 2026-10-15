import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductNewPage from '@/features/products/components/product-new-page';
import ProductNewSkeleton from '@/features/products/components/product-new-skeleton';

export const metadata = {
  title: 'Dashboard : New Product'
};

export default async function Page() {
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<ProductNewSkeleton />}>
          <ProductNewPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
