import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import DutiesCommercialAgreementsNewPage from '@/features/parameters/duties_commercial_agreements/components/duties-commercial-agreements-new-page';
import ProductNewSkeleton from '@/features/products/components/product-new-skeleton';

export const metadata = {
  title: 'Parameters: New Duty Commercial Agreement'
};

export default async function Page() {
  return (
    <PageContainer scrollable>
      <div className='flex-1 gap-4'>
        <Suspense fallback={<ProductNewSkeleton />}>
          <DutiesCommercialAgreementsNewPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
