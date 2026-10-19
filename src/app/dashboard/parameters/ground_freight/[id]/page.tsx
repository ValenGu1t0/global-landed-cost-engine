import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductViewSkeleton from '@/features/products/components/product-view-skeleton';
import GroundFreightViewPage from '@/features/parameters/ground_freight/components/ground-freight-view-page';

export const metadata = {
  title: 'Parameters: View Ground Freight'
};

type PageProps = { params: Promise<{ id: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;

  return (
    <PageContainer scrollable>
      <div className='flex-1 gap-4'>
        <Suspense fallback={<ProductViewSkeleton />}>
          <GroundFreightViewPage id={params.id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
