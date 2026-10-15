import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductNewSkeleton from '@/features/products/components/product-new-skeleton';
import HTSNewPage from '@/features/parameters/HTS/components/hts-new-page';

export const metadata = {
  title: 'Parameters : New HTS Code'
};

export default async function Page() {
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<ProductNewSkeleton />}>
          <HTSNewPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
