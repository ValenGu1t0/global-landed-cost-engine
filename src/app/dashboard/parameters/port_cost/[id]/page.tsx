import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductViewSkeleton from '@/features/products/components/product-view-skeleton';
import PortCostViewPage from '@/features/parameters/port_cost/components/port-cost-view-page';

export const metadata = {
  title: 'Parameters: View Port Cost'
};

type PageProps = { params: Promise<{ id: number }> };

export default async function Page(props: PageProps) {
  const params = await props.params;

  return (
    <PageContainer scrollable>
      <div className='flex-1 gap-4'>
        <Suspense fallback={<ProductViewSkeleton />}>
          <PortCostViewPage id={params.id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
