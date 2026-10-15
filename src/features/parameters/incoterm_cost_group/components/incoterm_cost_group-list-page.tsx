import { IncotermCostGroupTable } from './incoterm_cost_group-table';
import { columns } from './incoterm_cost_group-table/columns';
import { getIncotermCostGroups } from '../data/get-incoterm_cost_groups';
import { incotermCostGroupSearchParamsCache } from '../searchparams';

type IncotermCostGroupListPage = {};

export default async function IncotermCostGroupListPage({}: IncotermCostGroupListPage) {
  const page = incotermCostGroupSearchParamsCache.get('page');
  const search = incotermCostGroupSearchParamsCache.get('search');
  const perPage = incotermCostGroupSearchParamsCache.get('perPage');
  const sortBy = incotermCostGroupSearchParamsCache.get('sortBy');
  const sortDirection = incotermCostGroupSearchParamsCache.get('sortDirection');

  const filters = {
    page,
    limit: perPage,
    ...(search && { search }),
    ...(sortBy && { sortBy }),
    ...(sortDirection && { sortDirection })
  };

  const data = await getIncotermCostGroups(filters);
  const totalIncotermCostGroups = data.totalCount;
  const incoterm_cost_groups = data.incoterm_cost_groups;

  return (
    <IncotermCostGroupTable
      data={incoterm_cost_groups}
      totalIncotermCostGroupCodes={totalIncotermCostGroups}
      columns={columns}
    />
  );
}
