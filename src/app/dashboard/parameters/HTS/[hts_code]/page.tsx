import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductViewSkeleton from '@/features/products/components/product-view-skeleton';
import HTSViewPage from '@/features/parameters/HTS/components/hts-view-page';

export const metadata = {
  title: 'Dashboard : View Product'
};

type PageProps = { params: Promise<{ hts_code: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<ProductViewSkeleton />}>
          <HTSViewPage hts_code={params.hts_code} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
