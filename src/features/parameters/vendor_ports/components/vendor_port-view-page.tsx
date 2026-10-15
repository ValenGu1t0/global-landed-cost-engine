import { notFound } from 'next/navigation';
import { getVendorPortId } from '../data/get-vendor_port-id';
import VendorPortViewForm from './vendor_port-form';

type TVendorPortViewPageProps = {
  id: string | number;
};

export default async function VendorPortViewPage({
  id
}: TVendorPortViewPageProps) {
  // Normalización: convertir siempre a number
  const numericId = Number(id);

  // Si el parse falló (NaN), abortar
  if (Number.isNaN(numericId)) {
    notFound();
  }

  const fetchedVendorPort = await getVendorPortId({ id: numericId });

  if (!fetchedVendorPort) {
    notFound();
  }

  return (
    <VendorPortViewForm
      initialData={fetchedVendorPort}
      pageTitle='View Vendor Port'
    />
  );
}
