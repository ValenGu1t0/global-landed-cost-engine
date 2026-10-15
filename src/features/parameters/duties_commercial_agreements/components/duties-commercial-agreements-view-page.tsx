import { notFound } from 'next/navigation';
import { getDutiesCommercialAgreementById } from '../data/get-duties-commercial-agreements-by-id';
import DutiesCommercialAgreementsViewForm from './duties-commercial-agreements-view-form';

type TProductViewPageProps = {
  id: string;
};

export default async function DutiesCommercialAgreementsViewPage({
  id
}: TProductViewPageProps) {
  const fetchedProduct = await getDutiesCommercialAgreementById({
    id: Number(id)
  });
  if (!fetchedProduct) {
    notFound();
  }

  return (
    <DutiesCommercialAgreementsViewForm
      initialData={fetchedProduct}
      pageTitle='View Duty Commercial Agreement'
    />
  );
}
