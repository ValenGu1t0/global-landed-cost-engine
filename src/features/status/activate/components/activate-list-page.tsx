import { activateStatusSearchParamsCache } from '@/features/status/activate/searchparams';
import { columns } from './activate-table/columns';
import { ActivateTableComponent } from './activate-table';
import { getProductsToActivate } from '../data/get-products-to-activate';
import { GetProductsToActivateSchema } from '../data/get-products-to-activate-schema';

type ActivateListPage = {};

export default async function ActivateStatusPage({}: ActivateListPage) {
  const page = activateStatusSearchParamsCache.get('page');
  const pageLimit = activateStatusSearchParamsCache.get('perPage');
  const sortBy = activateStatusSearchParamsCache.get('sortBy');
  const sortDirection = activateStatusSearchParamsCache.get('sortDirection');
  const hemicode = activateStatusSearchParamsCache.get('hemicode');

  const rawStatus = activateStatusSearchParamsCache.get('status');
  const status: GetProductsToActivateSchema['status'] =
    Array.isArray(rawStatus) && rawStatus.length > 0
      ? rawStatus.filter(
          (s): s is 'INACTIVE' | 'PROJECT' | 'GS' =>
            s === 'INACTIVE' || s === 'PROJECT' || s === 'GS'
        )
      : undefined;

  const filters = {
    page,
    limit: pageLimit,
    ...(hemicode && { hemicode }),
    ...(status && { status }),
    ...(sortBy && { sortBy }),
    ...(sortDirection && { sortDirection })
  };

  const data = await getProductsToActivate(filters);

  return (
    <ActivateTableComponent
      data={data.products}
      totalItems={data.totalCount}
      columns={columns}
    />
  );
}
