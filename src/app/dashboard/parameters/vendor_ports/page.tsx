import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { VendorPortActions } from '@/features/parameters/vendor_ports/components/vendor_port-actions';
import VendorPortListPage from '@/features/parameters/vendor_ports/components/vendor_port-list-page';
import ProductListSkeleton from '@/features/products/components/product-list-skeleton';
import {
  vendorPortsSearchParamsCache,
  serializeVendorPortsParams
} from '@/features/parameters/vendor_ports/searchparams';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { VendorPortFilters } from '@/features/parameters/vendor_ports/components/vendor_port-filters';

import { ParameterInfoBanner } from '@/components/parameters/parameter-info-banner';
import { PARAMETER_DOCS } from '@/constants/parameter-docs';

export const metadata = {
  title: 'Parameters: Vendor Ports'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  vendorPortsSearchParamsCache.parse(searchParams);

  const key = serializeVendorPortsParams({ ...searchParams });

  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between'>
          <Heading title='Vendor Ports' description='Manage Vendor Ports' />
          <VendorPortActions />
        </div>

        <Separator />

        <ParameterInfoBanner {...PARAMETER_DOCS.vendor_ports} />

        {/* Input busqueda? */}
        <Suspense fallback={<div className='h-9' />}>
          <VendorPortFilters />
        </Suspense>

        <Suspense key={key} fallback={<ProductListSkeleton />}>
          <VendorPortListPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
