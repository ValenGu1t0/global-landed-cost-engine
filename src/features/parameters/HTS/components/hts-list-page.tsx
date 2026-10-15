import { HTSTable } from './hts-table';
import { columns } from './hts-table/columns';
import { getHTSCodes } from '../data/get-hts-codes';
import { htsSearchParamsCache } from '../searchparams';

type HTSListPage = {};

export default async function HTSListPage({}: HTSListPage) {
  const page = htsSearchParamsCache.get('page');
  const search = htsSearchParamsCache.get('search');
  const perPage = htsSearchParamsCache.get('perPage');
  const sortBy = htsSearchParamsCache.get('sortBy');
  const sortDirection = htsSearchParamsCache.get('sortDirection');

  const filters = {
    page,
    limit: perPage,
    ...(search && { search }),
    ...(sortBy && { sortBy }),
    ...(sortDirection && { sortDirection })
  };

  const data = await getHTSCodes(filters);
  const totalHTSCodes = data.totalCount;
  const hts_codes = data.htscodes;

  return (
    <HTSTable
      data={hts_codes}
      totalHTSCodes={totalHTSCodes}
      columns={columns}
    />
  );
}
