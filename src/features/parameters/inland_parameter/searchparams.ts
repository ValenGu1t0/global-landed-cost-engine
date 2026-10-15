import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum
} from 'nuqs/server';

export const inlandParameterSearchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),

  // Contempla todos los campos que tengan text
  search: parseAsString,

  sortBy: parseAsString,
  sortDirection: parseAsStringEnum(['asc', 'desc'])
};

export const inlandParameterSearchParamsCache = createSearchParamsCache(
  inlandParameterSearchParams
);

export const serializeInlandParameterParams = createSerializer(
  inlandParameterSearchParams
);
