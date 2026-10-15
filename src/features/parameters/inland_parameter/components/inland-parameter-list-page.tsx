import { InlandParameterTable } from './inland-parameter-table';
import { columns } from './inland-parameter-table/columns';
import { getInlandParameters } from '../data/get-inland-parameter';
import { inlandParameterSearchParamsCache } from '../searchparams';

type InlandParameterListPage = {};

export default async function InlandParameterListPage({}: InlandParameterListPage) {
  const page = inlandParameterSearchParamsCache.get('page');
  const perPage = inlandParameterSearchParamsCache.get('perPage');
  const search = inlandParameterSearchParamsCache.get('search');
  const sortBy = inlandParameterSearchParamsCache.get('sortBy');
  const sortDirection = inlandParameterSearchParamsCache.get('sortDirection');

  const filters = {
    page,
    limit: perPage,
    ...(search && { search }),
    ...(sortBy && { sortBy }),
    ...(sortDirection && { sortDirection })
  };

  const data = await getInlandParameters(filters);
  const totalInlandParameters = data.totalCount;
  const inlandParameters = data.inland_parameters;

  return (
    <InlandParameterTable
      data={inlandParameters}
      totalInlandParameters={totalInlandParameters}
      columns={columns}
    />
  );
}
