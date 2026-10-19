import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductNewSkeleton from '@/features/products/components/product-new-skeleton';
import IncotermCostGroupNewPage from '@/features/parameters/incoterm_cost_group/components/incoterm_cost_group-new-page';

export const metadata = {
  title: 'Parameters : New HTS Code'
};

export default async function Page() {
  return (
    <PageContainer scrollable>
      <div className='flex-1 gap-4'>
        <Suspense fallback={<ProductNewSkeleton />}>
          <IncotermCostGroupNewPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
