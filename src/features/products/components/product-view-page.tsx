import { notFound } from 'next/navigation';
import ProductViewForm from './product-view-form';
import { getProductById } from '../data/get-product-by-id';

type TProductViewPageProps = {
  productId: string;
};

export default async function ProductViewPage({
  productId
}: TProductViewPageProps) {
  const fetchedProduct = await getProductById({ id: Number(productId) });
  if (!fetchedProduct) {
    notFound();
  }

  return (
    <ProductViewForm initialData={fetchedProduct} pageTitle='View Product' />
  );
}
