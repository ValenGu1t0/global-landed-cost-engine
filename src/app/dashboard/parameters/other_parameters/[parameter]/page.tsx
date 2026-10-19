import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductViewSkeleton from '@/features/products/components/product-view-skeleton';
import OtherParameterViewPage from '@/features/parameters/other_parameters/components/other_parameter-view-page';

export const metadata = {
  title: 'Dashboard : View Other Parameter'
};

type PageProps = { params: Promise<{ parameter: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;

  return (
    <PageContainer scrollable>
      <div className='flex-1 gap-4'>
        <Suspense fallback={<ProductViewSkeleton />}>
          <OtherParameterViewPage parameter={params.parameter} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
