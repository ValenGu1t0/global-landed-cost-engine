import { productSearchParamsCache } from '@/features/products/searchparams';
import { ProductTable } from './product-tables';
import { columns } from './product-tables/columns';
import { getProducts } from '../data/get-products';

type ProductListPage = {};

export default async function ProductListPage({}: ProductListPage) {
  const page = productSearchParamsCache.get('page');
  const search = productSearchParamsCache.get('name');
  const pageLimit = productSearchParamsCache.get('perPage');
  const categories = productSearchParamsCache.get('category');
  const sortBy = productSearchParamsCache.get('sortBy');
  const sortDirection = productSearchParamsCache.get('sortDirection');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(categories && { category: categories }),
    ...(sortBy && { sortBy }),
    ...(sortDirection && { sortDirection })
  };

  const data = await getProducts(filters);
  const totalProducts = data.totalCount;
  const products = data.products;

  return (
    <ProductTable
      data={products}
      totalItems={totalProducts}
      columns={columns}
    />
  );
}
