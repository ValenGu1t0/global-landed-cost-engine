import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum
} from 'nuqs/server';

export const productSearchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  name: parseAsString,
  category: parseAsString,
  area: parseAsString,
  subArea: parseAsString,
  sortBy: parseAsString,
  sortDirection: parseAsStringEnum(['asc', 'desc'])
};

export const productSearchParamsCache =
  createSearchParamsCache(productSearchParams);
export const serializeProductParams = createSerializer(productSearchParams);
