import { notFound } from 'next/navigation';
import PortCostViewForm from './port-cost-view-form';
import { getPortCostById } from '../data/get-port-cost-id';

type TProductViewPageProps = {
  id: number;
};

export default async function PortCostViewPage({ id }: TProductViewPageProps) {
  const fetchedPortCost = await getPortCostById({
    id: id
  });

  if (!fetchedPortCost) {
    notFound();
  }

  return (
    <PortCostViewForm
      initialData={fetchedPortCost}
      pageTitle='View Port Cost'
    />
  );
}
