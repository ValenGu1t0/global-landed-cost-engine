import { TariffHTSExceptionsTable } from './tariff-hts-exceptions-table/index';
import { columns } from './tariff-hts-exceptions-table/columns';
import { tariffHTSExceptionsSearchParamsCache } from '../searchparams';
import { getTariffHTSExceptions } from '../data/get-tariff-hts-exception';

type TariffHTSExceptionsListPage = {};

export default async function TariffHTSExceptionsListPage({}: TariffHTSExceptionsListPage) {
  const page = tariffHTSExceptionsSearchParamsCache.get('page');
  const search = tariffHTSExceptionsSearchParamsCache.get('search');
  const perPage = tariffHTSExceptionsSearchParamsCache.get('perPage');
  const sortBy = tariffHTSExceptionsSearchParamsCache.get('sortBy');
  const sortDirection =
    tariffHTSExceptionsSearchParamsCache.get('sortDirection');

  const filters = {
    page,
    limit: perPage,
    ...(search && { search }),
    ...(sortBy && { sortBy }),
    ...(sortDirection && { sortDirection })
  };

  const data = await getTariffHTSExceptions(filters);
  const totalTariffHTSException = data.totalCount;
  const tariff_hts_exceptions = data.tariff_hts_exceptions;

  return (
    <TariffHTSExceptionsTable
      data={tariff_hts_exceptions}
      totalTariffHTSException={totalTariffHTSException}
      columns={columns}
    />
  );
}
