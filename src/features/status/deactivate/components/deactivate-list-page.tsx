import { deactivateStatusSearchParamsCache } from '@/features/status/deactivate/searchparams';
import { DeactivateTableComponent } from './deactivate-table';
import { columns } from './deactivate-table/columns';
import { getProductsToDeactivate } from '../data/get-products-to-deactivate';

type DeactivateListPage = {};

export default async function DeactivateStatusPage({}: DeactivateListPage) {
  const page = deactivateStatusSearchParamsCache.get('page');
  const sortBy = deactivateStatusSearchParamsCache.get('sortBy');
  const sortDirection = deactivateStatusSearchParamsCache.get('sortDirection');
  const pageLimit = deactivateStatusSearchParamsCache.get('perPage');

  const status = deactivateStatusSearchParamsCache.get('status');
  const hemicode = deactivateStatusSearchParamsCache.get('hemicode');

  const filters = {
    page,
    limit: pageLimit,
    ...(hemicode && { hemicode }),
    ...(status && { status: status }),
    ...(sortBy && { sortBy }),
    ...(sortDirection && { sortDirection })
  };

  const data = await getProductsToDeactivate(filters);
  const totalProducts = data.totalCount;
  const productsView = data.products;

  return (
    <DeactivateTableComponent
      data={productsView}
      totalItems={totalProducts}
      columns={columns}
    />
  );
}
