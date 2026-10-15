import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductViewSkeleton from '@/features/products/components/product-view-skeleton';
import HTSViewPage from '@/features/parameters/HTS/components/hts-view-page';
import VendorPortViewPage from '@/features/parameters/vendor_ports/components/vendor_port-view-page';

export const metadata = {
  title: 'Parameters : New Vendor Port'
};

type PageProps = { params: Promise<{ id: number }> };

export default async function Page(props: PageProps) {
  const params = await props.params;

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<ProductViewSkeleton />}>
          <VendorPortViewPage id={params.id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
