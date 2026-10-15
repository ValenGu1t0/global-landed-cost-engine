import { notFound } from 'next/navigation';
import { getIncotermCostGroupId } from '../data/get-incoterm_cost_group-id';
import IncotermCostGroupViewForm from './incoterm_cost_group-view-form';

type TIncotermCostGroupViewPageProps = {
  id: number;
};

export default async function IncotermCostGroupViewPage({
  id
}: TIncotermCostGroupViewPageProps) {
  const fetchedIncotermCostGroup = await getIncotermCostGroupId({ id: id });

  if (!fetchedIncotermCostGroup) {
    notFound();
  }

  return (
    <IncotermCostGroupViewForm
      initialData={fetchedIncotermCostGroup}
      pageTitle='View Incoterm Cost Group'
    />
  );
}
