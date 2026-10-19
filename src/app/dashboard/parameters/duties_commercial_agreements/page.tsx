import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DutiesCommercialAgreementsActions } from '@/features/parameters/duties_commercial_agreements/components/duties-commercial_agreements-actions';
import { DutiesCommercialAgreementsFilters } from '@/features/parameters/duties_commercial_agreements/components/duties-commercial_agreements-filters';
import DutiesCommercialAgreementsListPage from '@/features/parameters/duties_commercial_agreements/components/duties-commercial_agreements-list-page';
import ProductListSkeleton from '@/features/products/components/product-list-skeleton';
import {
  dutiesSearchParamsCache,
  serializeDutiesParams
} from '@/features/parameters/duties_commercial_agreements/searchparams';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

import { ParameterInfoBanner } from '@/components/parameters/parameter-info-banner';
import { PARAMETER_DOCS } from '@/constants/parameter-docs';

export const metadata = {
  title: 'Parameters: Duties Commercial Agreements'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  dutiesSearchParamsCache.parse(searchParams);
  const key = serializeDutiesParams(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className='flex min-h-0 min-w-0 flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between'>
          <Heading
            title='Duties Commercial Agreements'
            description='Manage Duties Commercial Agreements'
          />
          <DutiesCommercialAgreementsActions />
        </div>

        <Separator />

        <ParameterInfoBanner {...PARAMETER_DOCS.duties_commercial_agreements} />

        <Suspense fallback={<div className='h-9' />}>
          <DutiesCommercialAgreementsFilters />
        </Suspense>

        <Suspense key={key} fallback={<ProductListSkeleton />}>
          <DutiesCommercialAgreementsListPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
