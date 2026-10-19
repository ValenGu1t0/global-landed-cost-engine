import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductNewSkeleton from '@/features/products/components/product-new-skeleton';
import TariffHTSExceptionNewPage from '@/features/parameters/tariff_hts_exceptions/components/tariff-hts-exceptions-new-page';

export const metadata = {
  title: 'Parameters: New Tariff HTS Exception'
};

export default async function Page() {
  return (
    <PageContainer scrollable>
      <div className='flex-1 gap-4'>
        <Suspense fallback={<ProductNewSkeleton />}>
          <TariffHTSExceptionNewPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
