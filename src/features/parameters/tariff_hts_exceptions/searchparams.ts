import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum
} from 'nuqs/server';

export const tariffHTSExceptionsSearchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),

  // Unico input que busca en todos los campos que sean .text
  search: parseAsString,

  sortBy: parseAsString,
  sortDirection: parseAsStringEnum(['asc', 'desc'])
};

export const tariffHTSExceptionsSearchParamsCache = createSearchParamsCache(
  tariffHTSExceptionsSearchParams
);

export const serializeTariffHTSExceptionsParams = createSerializer(
  tariffHTSExceptionsSearchParams
);
