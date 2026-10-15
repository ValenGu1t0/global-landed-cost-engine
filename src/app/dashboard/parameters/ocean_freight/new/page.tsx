import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductNewSkeleton from '@/features/products/components/product-new-skeleton';
import OceanFreightNewPage from '@/features/parameters/ocean_freight/components/ocean-freight-new-page';

export const metadata = {
  title: 'Parameters: New Ocean Freight Parameter'
};

export default async function Page() {
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<ProductNewSkeleton />}>
          <OceanFreightNewPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
