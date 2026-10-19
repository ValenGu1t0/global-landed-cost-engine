import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductViewSkeleton from '@/features/products/components/product-view-skeleton';
import ProductsViewPage from '@/features/products_view/components/products-view-page';

export const metadata = {
  title: 'Dashboard: View Product'
};

type PageProps = { params: Promise<{ tech_sku_id: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 gap-4'>
        <Suspense fallback={<ProductViewSkeleton />}>
          <ProductsViewPage tech_sku_id={params.tech_sku_id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
