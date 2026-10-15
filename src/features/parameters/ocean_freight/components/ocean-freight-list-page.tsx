import { OceanFreightTable } from './ocean-freight-table/index';
import { columns } from './ocean-freight-table/columns';
import { getOceanFreight } from '../data/get-ocean-freight';
import { oceanFreightSearchParamsCache } from '../searchparams';

type OceanFreightListPage = {};

export default async function OceanFreightListPage({}: OceanFreightListPage) {
  const page = oceanFreightSearchParamsCache.get('page');
  const search = oceanFreightSearchParamsCache.get('search');
  const perPage = oceanFreightSearchParamsCache.get('perPage');
  const sortBy = oceanFreightSearchParamsCache.get('sortBy');
  const sortDirection = oceanFreightSearchParamsCache.get('sortDirection');

  const filters = {
    page,
    limit: perPage,
    ...(search && { search }),
    ...(sortBy && { sortBy }),
    ...(sortDirection && { sortDirection })
  };

  const data = await getOceanFreight(filters);
  const totalOceanFreights = data.totalCount;
  const ocean_freights = data.ocean_freight;

  return (
    <OceanFreightTable
      data={ocean_freights}
      totalOceanFreights={totalOceanFreights}
      columns={columns}
    />
  );
}
