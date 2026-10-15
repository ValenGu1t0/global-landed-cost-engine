import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum
} from 'nuqs/server';

export const productsViewSearchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  name: parseAsString,
  stock: parseAsString,
  type: parseAsString,
  vendor: parseAsString,
  brand_name: parseAsString,
  category: parseAsString,
  consumer_use: parseAsString,
  product_collection: parseAsString,
  raw_material: parseAsString,
  season: parseAsString,
  set_collection: parseAsString,
  status: parseAsString,
  sortBy: parseAsString,
  sortDirection: parseAsStringEnum(['asc', 'desc'])
};

export const productsViewSearchParamsCache = createSearchParamsCache(
  productsViewSearchParams
);
export const serializeProductsViewParams = createSerializer(
  productsViewSearchParams
);
