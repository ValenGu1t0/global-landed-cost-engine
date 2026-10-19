import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductViewSkeleton from '@/features/products/components/product-view-skeleton';
import OceanFreightViewPage from '@/features/parameters/ocean_freight/components/ocean-freight-view-page';

export const metadata = {
  title: 'Parameters: View Ocean Freight'
};

type PageProps = { params: Promise<{ id: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;

  return (
    <PageContainer scrollable>
      <div className='flex-1 gap-4'>
        <Suspense fallback={<ProductViewSkeleton />}>
          <OceanFreightViewPage id={params.id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
