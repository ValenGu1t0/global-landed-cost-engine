import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductViewSkeleton from '@/features/products/components/product-view-skeleton';
import TariffHTSExceptionsViewPage from '@/features/parameters/tariff_hts_exceptions/components/tariff-hts-exceptions-view-page';

export const metadata = {
  title: 'Parameters: Tariff HTS Exceptions'
};

type PageProps = { params: Promise<{ id: number }> };

export default async function Page(props: PageProps) {
  const params = await props.params;

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<ProductViewSkeleton />}>
          <TariffHTSExceptionsViewPage id={params.id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
