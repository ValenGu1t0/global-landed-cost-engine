import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductNewSkeleton from '@/features/products/components/product-new-skeleton';
import OtherParameterNewPage from '@/features/parameters/other_parameters/components/other_parameter-new-page';

export const metadata = {
  title: 'Parameters : New Other Parameter'
};

export default async function Page() {
  return (
    <PageContainer scrollable>
      <div className='flex-1 gap-4'>
        <Suspense fallback={<ProductNewSkeleton />}>
          <OtherParameterNewPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
