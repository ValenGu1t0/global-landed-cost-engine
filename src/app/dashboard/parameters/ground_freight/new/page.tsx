import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductNewSkeleton from '@/features/products/components/product-new-skeleton';
import GroundFreightNewPage from '@/features/parameters/ground_freight/components/ground-freight-new-page';

export const metadata = {
  title: 'Parameters: New Ground Freight Parameter'
};

export default async function Page() {
  return (
    <PageContainer scrollable>
      <div className='flex-1 gap-4'>
        <Suspense fallback={<ProductNewSkeleton />}>
          <GroundFreightNewPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
