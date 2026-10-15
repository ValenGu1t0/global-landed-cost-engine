import { notFound } from 'next/navigation';
import { getTariffHTSExceptionId } from '../data/get-tariff-hts-exception-id';
import TariffHTSExceptionsViewForm from './tariff-hts-exceptions-view-form';

type TProductViewPageProps = {
  id: number;
};

export default async function TariffHTSExceptionsViewPage({
  id
}: TProductViewPageProps) {
  const fetchedTariffHTSException = await getTariffHTSExceptionId({
    id: id
  });

  if (!fetchedTariffHTSException) {
    notFound();
  }

  return (
    <TariffHTSExceptionsViewForm
      initialData={fetchedTariffHTSException}
      pageTitle='View Tariff HTS Exception'
    />
  );
}
