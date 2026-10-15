import { notFound } from 'next/navigation';
import { getOceanFreightId } from '../data/get-ocean-freight-id';
import OceanFreightViewForm from './ocean-freight-view-form';

type TProductViewPageProps = {
  id: string;
};

export default async function OceanFreightViewPage({
  id
}: TProductViewPageProps) {
  const fetchedOceanFreight = await getOceanFreightId({
    id: Number(id)
  });

  if (!fetchedOceanFreight) {
    notFound();
  }

  return (
    <OceanFreightViewForm
      initialData={fetchedOceanFreight}
      pageTitle='View Ocean Freight'
    />
  );
}
