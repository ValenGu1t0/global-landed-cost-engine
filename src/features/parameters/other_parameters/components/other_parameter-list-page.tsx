import { OtherParameterTable } from './other_parameter-table';
import { columns } from './other_parameter-table/columns';
import { getOtherParameters } from '../data/get-other_parameters';
import { otherParameterSearchParamsCache } from '../searchparams';

type OtherParametersListPage = {};

export default async function OtherParametersListPage({}: OtherParametersListPage) {
  const page = otherParameterSearchParamsCache.get('page');
  const search = otherParameterSearchParamsCache.get('search');
  const perPage = otherParameterSearchParamsCache.get('perPage');
  const sortBy = otherParameterSearchParamsCache.get('sortBy');
  const sortDirection = otherParameterSearchParamsCache.get('sortDirection');

  const filters = {
    page,
    limit: perPage,
    ...(search && { search }),
    ...(sortBy && { sortBy }),
    ...(sortDirection && { sortDirection })
  };

  const data = await getOtherParameters(filters);
  const totalOtherParameters = data.totalCount;
  const other_parameters = data.otherParameters;

  return (
    <OtherParameterTable
      data={other_parameters}
      totalOtherParameters={totalOtherParameters}
      columns={columns}
    />
  );
}
