import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductViewSkeleton from '@/features/products/components/product-view-skeleton';
import DutiesCommercialAgreementsViewPage from '@/features/parameters/duties_commercial_agreements/components/duties-commercial-agreements-view-page';

export const metadata = {
  title: 'Dashboard: View Duties Commercial Agreements'
};

type PageProps = { params: Promise<{ id: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<ProductViewSkeleton />}>
          <DutiesCommercialAgreementsViewPage id={params.id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
