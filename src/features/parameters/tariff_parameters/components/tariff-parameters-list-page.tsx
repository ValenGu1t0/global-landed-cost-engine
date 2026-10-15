import { TariffParametersTable } from './tariff-parameters-table/index';
import { columns } from './tariff-parameters-table/columns';
import { getTariffParameters } from '../data/get-tariff-parameters';
import { tariffParametersSearchParamsCache } from '../searchparams';

type TariffParametersListPage = {};

export default async function TariffParametersListPage({}: TariffParametersListPage) {
  const page = tariffParametersSearchParamsCache.get('page');
  const search = tariffParametersSearchParamsCache.get('search');
  const perPage = tariffParametersSearchParamsCache.get('perPage');
  const sortBy = tariffParametersSearchParamsCache.get('sortBy');
  const sortDirection = tariffParametersSearchParamsCache.get('sortDirection');

  const filters = {
    page,
    limit: perPage,
    ...(search && { search }),
    ...(sortBy && { sortBy }),
    ...(sortDirection && { sortDirection })
  };

  const data = await getTariffParameters(filters);
  const totalTariffParameters = data.totalCount;
  const tariff_parameters = data.tariff_parameters;

  return (
    <TariffParametersTable
      data={tariff_parameters}
      totalTariffParameters={totalTariffParameters}
      columns={columns}
    />
  );
}
