import { getCategories } from '../data/categories/get-categories';
import ProductsViewNewForm from './products-view-new-form';

export default async function ProductViewNewPage() {
  const categories = await getCategories();
  const formattedCategories = categories.map((c) => ({
    value: c.id,
    label: c.label
  }));

  return (
    <ProductsViewNewForm
      pageTitle='Create New Product'
      categories={formattedCategories}
    />
  );
}
