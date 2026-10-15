import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum
} from 'nuqs/server';

export const oceanFreightSearchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),

  // Unico input que busca en todos los campos que sean .text
  search: parseAsString,

  sortBy: parseAsString,
  sortDirection: parseAsStringEnum(['asc', 'desc'])
};

export const oceanFreightSearchParamsCache = createSearchParamsCache(
  oceanFreightSearchParams
);

export const serializeOceanFreightParams = createSerializer(
  oceanFreightSearchParams
);
