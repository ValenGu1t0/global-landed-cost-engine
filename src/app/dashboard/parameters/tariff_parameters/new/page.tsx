import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductNewSkeleton from '@/features/products/components/product-new-skeleton';
import TariffParametersNewPage from '@/features/parameters/tariff_parameters/components/tariff-parameters-new-page';

export const metadata = {
  title: 'Parameters: New Tariff Parameter'
};

export default async function Page() {
  return (
    <PageContainer scrollable>
      <div className='flex-1 gap-4'>
        <Suspense fallback={<ProductNewSkeleton />}>
          <TariffParametersNewPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
