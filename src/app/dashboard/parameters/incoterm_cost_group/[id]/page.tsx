import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductViewSkeleton from '@/features/products/components/product-view-skeleton';
import IncotermCostGroupViewPage from '@/features/parameters/incoterm_cost_group/components/incoterm_cost_group-view-page';

export const metadata = {
  title: 'Dashboard : View Incoterm Cost Groups'
};

type PageProps = { params: Promise<{ id: number }> };

export default async function Page(props: PageProps) {
  const params = await props.params;

  return (
    <PageContainer scrollable>
      <div className='flex-1 gap-4'>
        <Suspense fallback={<ProductViewSkeleton />}>
          <IncotermCostGroupViewPage id={params.id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
