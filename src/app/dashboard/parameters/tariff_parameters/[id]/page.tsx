import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductViewSkeleton from '@/features/products/components/product-view-skeleton';
import TariffParameterViewPage from '@/features/parameters/tariff_parameters/components/tariff-parameter-view-page';

export const metadata = {
  title: 'Parameters: View Tariff Parameter'
};

type PageProps = { params: Promise<{ id: number }> };

export default async function Page(props: PageProps) {
  const params = await props.params;

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<ProductViewSkeleton />}>
          <TariffParameterViewPage id={params.id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
