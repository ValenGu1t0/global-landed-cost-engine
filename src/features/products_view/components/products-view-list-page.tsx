import { productsViewSearchParamsCache } from '@/features/products_view/searchparams';
import { ProductsViewTableComponent } from './products-view-table/index';
import { columns } from './products-view-table/columns';
import { getProductsView } from '../data/get-products-view';

type ProductsViewListPage = {};

export default async function ProductsViewListPage({}: ProductsViewListPage) {
  const page = productsViewSearchParamsCache.get('page');
  const search = productsViewSearchParamsCache.get('name');
  const pageLimit = productsViewSearchParamsCache.get('perPage');
  const stock = productsViewSearchParamsCache.get('stock');
  const type = productsViewSearchParamsCache.get('type');
  const vendor = productsViewSearchParamsCache.get('vendor');
  const brand_name = productsViewSearchParamsCache.get('brand_name');
  const category = productsViewSearchParamsCache.get('category');
  const consumer_use = productsViewSearchParamsCache.get('consumer_use');
  const product_collection =
    productsViewSearchParamsCache.get('product_collection');
  const raw_material = productsViewSearchParamsCache.get('raw_material');
  const season = productsViewSearchParamsCache.get('season');
  const set_collection = productsViewSearchParamsCache.get('set_collection');
  const status = productsViewSearchParamsCache.get('status');
  const sortBy = productsViewSearchParamsCache.get('sortBy');
  const sortDirection = productsViewSearchParamsCache.get('sortDirection');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(stock && { stock: stock }),
    ...(type && { type: type }),
    ...(vendor && { vendor: vendor }),
    ...(brand_name && { brand_name: brand_name }),
    ...(category && { category: category }),
    ...(consumer_use && { consumer_use: consumer_use }),
    ...(product_collection && { product_collection: product_collection }),
    ...(raw_material && { raw_material: raw_material }),
    ...(season && { season: season }),
    ...(set_collection && { set_collection: set_collection }),
    ...(status && { status: status }),
    ...(sortBy && { sortBy }),
    ...(sortDirection && { sortDirection })
  };

  const data = await getProductsView(filters);
  const totalProducts = data.totalCount;
  const productsView = data.products;

  return (
    <ProductsViewTableComponent
      data={productsView}
      totalItems={totalProducts}
      columns={columns}
    />
  );
}
