import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductNewSkeleton from '@/features/products/components/product-new-skeleton';
import VendorPortNewPage from '@/features/parameters/vendor_ports/components/vendor_port-new-page';

export const metadata = {
  title: 'Parameters : New Vendor Port'
};

export default async function Page() {
  return (
    <PageContainer scrollable>
      <div className='flex-1 gap-4'>
        <Suspense fallback={<ProductNewSkeleton />}>
          <VendorPortNewPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
