import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductNewSkeleton from '@/features/products/components/product-new-skeleton';
import PortCostNewPage from '@/features/parameters/port_cost/components/port-cost-new-page';

export const metadata = {
  title: 'Parameters: New Port Cost'
};

export default async function Page() {
  return (
    <PageContainer scrollable>
      <div className='flex-1 gap-4'>
        <Suspense fallback={<ProductNewSkeleton />}>
          <PortCostNewPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
