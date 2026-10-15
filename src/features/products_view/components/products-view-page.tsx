import { notFound } from 'next/navigation';
import { getProductById } from '../data/get-product-by-id';
import ProductViewForm from './products-view-form';
import { getCategories } from '../data/categories/get-categories';

type TProductViewPageProps = {
  tech_sku_id: string;
};

export default async function ProductViewPage({
  tech_sku_id
}: TProductViewPageProps) {
  const fetchedProduct = await getProductById({
    tech_sku_id: Number(tech_sku_id)
  });

  const categories = await getCategories();
  const formattedCategories = categories.map((c) => ({
    value: c.id,
    label: c.label
  }));

  if (!fetchedProduct) {
    notFound();
  }

  return (
    <ProductViewForm
      initialData={fetchedProduct}
      pageTitle='View Product'
      categories={formattedCategories}
    />
  );
}
