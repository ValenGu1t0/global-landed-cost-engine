import { notFound } from 'next/navigation';
import { getGroundFreightId } from '../data/get-ground-freight-id';
import GroundFreightViewForm from './ground-freight-view-form';

type TProductViewPageProps = {
  id: string;
};

export default async function GroundFreightViewPage({
  id
}: TProductViewPageProps) {
  const fetchedGroundFreight = await getGroundFreightId({
    id: Number(id)
  });

  if (!fetchedGroundFreight) {
    notFound();
  }

  return (
    <GroundFreightViewForm
      initialData={fetchedGroundFreight}
      pageTitle='View Ground Freight'
    />
  );
}
