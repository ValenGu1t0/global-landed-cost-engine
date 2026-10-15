import { PortCostTable } from './port-cost-table/index';
import { columns } from './port-cost-table/columns';
import { getPortCost } from '../data/get-port-cost';
import { portCostSearchParamsCache } from '../searchparams';

type PortCostListPage = {};

export default async function PortCostListPage({}: PortCostListPage) {
  const page = portCostSearchParamsCache.get('page');
  const search = portCostSearchParamsCache.get('search');
  const perPage = portCostSearchParamsCache.get('perPage');
  const sortBy = portCostSearchParamsCache.get('sortBy');
  const sortDirection = portCostSearchParamsCache.get('sortDirection');

  const filters = {
    page,
    limit: perPage,
    ...(search && { search }),
    ...(sortBy && { sortBy }),
    ...(sortDirection && { sortDirection })
  };

  const data = await getPortCost(filters);
  const totalPortCosts = data.totalCount;
  const port_costs = data.port_cost;

  return (
    <PortCostTable
      data={port_costs}
      totalPortCosts={totalPortCosts}
      columns={columns}
    />
  );
}
