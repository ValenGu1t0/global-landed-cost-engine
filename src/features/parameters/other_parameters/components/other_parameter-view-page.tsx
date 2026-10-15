import { notFound } from 'next/navigation';
import { getOtherParameterId } from '../data/get-other_parameter-id';
import OtherParameterViewForm from './other_parameter-view-form';

type TOtherParameterViewPageProps = {
  parameter: string;
};

export default async function OtherParameterViewPage({
  parameter
}: TOtherParameterViewPageProps) {
  const fetchedHTS = await getOtherParameterId({ parameter: parameter });

  if (!fetchedHTS) {
    notFound();
  }

  return (
    <OtherParameterViewForm initialData={fetchedHTS} pageTitle='View Product' />
  );
}
