import { dutiesSearchParamsCache } from '@/features/parameters/duties_commercial_agreements/searchparams';
import { DutiesCommercialAgreementsTable } from './duties-commercial-agreements-table/index';
import { getDutiesCommercialAgreements } from '../data/get-duties-commercial-agreements';
import { columns } from './duties-commercial-agreements-table/columns';

type DutiesListPageProps = {};

export default async function DutiesCommercialAgreementsListPage({}: DutiesListPageProps) {
  const page = dutiesSearchParamsCache.get('page');
  const search = dutiesSearchParamsCache.get('search');
  const perPage = dutiesSearchParamsCache.get('perPage');
  const sortBy = dutiesSearchParamsCache.get('sortBy');
  const sortDirection = dutiesSearchParamsCache.get('sortDirection');

  const filters = {
    page,
    limit: perPage,
    ...(search && { search }),
    ...(sortBy && { sortBy }),
    ...(sortDirection && { sortDirection })
  };

  const data = await getDutiesCommercialAgreements(filters);
  const totalItems = data.totalCount;
  const duties = data.duties;

  return (
    <DutiesCommercialAgreementsTable
      data={duties}
      totalItems={totalItems}
      columns={columns}
    />
  );
}
