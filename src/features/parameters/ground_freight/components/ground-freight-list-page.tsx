import { GroundFreightTable } from './ground-freight-table/index';
import { columns } from './ground-freight-table/columns';
import { getGroundFreight } from '../data/get-ground-freight';
import { groundFreightSearchParamsCache } from '../searchparams';

type GroundFreightListPage = {};

export default async function GroundFreightListPage({}: GroundFreightListPage) {
  const page = groundFreightSearchParamsCache.get('page');
  const search = groundFreightSearchParamsCache.get('search');
  const perPage = groundFreightSearchParamsCache.get('perPage');
  const sortBy = groundFreightSearchParamsCache.get('sortBy');
  const sortDirection = groundFreightSearchParamsCache.get('sortDirection');

  const filters = {
    page,
    limit: perPage,
    ...(search && { search }),
    ...(sortBy && { sortBy }),
    ...(sortDirection && { sortDirection })
  };

  const data = await getGroundFreight(filters);
  const totalGroundFreights = data.totalCount;
  const ground_freights = data.ground_freight;

  return (
    <GroundFreightTable
      data={ground_freights}
      totalGroundFreights={totalGroundFreights}
      columns={columns}
    />
  );
}
