import { notFound } from 'next/navigation';
import { getHTSCodeId } from '../data/get-hts-code-id';
import HTSViewForm from './hts-view-form';

type THTSViewPageProps = {
  hts_code: string;
};

export default async function HTSViewPage({ hts_code }: THTSViewPageProps) {
  const fetchedHTS = await getHTSCodeId({ hts_code: hts_code });

  if (!fetchedHTS) {
    notFound();
  }

  return <HTSViewForm initialData={fetchedHTS} pageTitle='View Product' />;
}
