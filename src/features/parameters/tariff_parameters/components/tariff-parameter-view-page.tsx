import { notFound } from 'next/navigation';
import { getTariffParameterId } from '../data/get-tariff-parameter-id';
import TariffParameterViewForm from './tariff-parameter-view-form';

type TProductViewPageProps = {
  id: number;
};

export default async function TariffParameterViewPage({
  id
}: TProductViewPageProps) {
  const fetchedTariffParameter = await getTariffParameterId({
    id: id
  });

  if (!fetchedTariffParameter) {
    notFound();
  }

  return (
    <TariffParameterViewForm
      initialData={fetchedTariffParameter}
      pageTitle='View Tariff Parameter'
    />
  );
}
