import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductNewSkeleton from '@/features/products/components/product-new-skeleton';
import InlandParameterNewPage from '@/features/parameters/inland_parameter/components/inland_parameter-new-page';

export const metadata = {
  title: 'Parameters : New Inland Parameter'
};

export default async function Page() {
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<ProductNewSkeleton />}>
          <InlandParameterNewPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
