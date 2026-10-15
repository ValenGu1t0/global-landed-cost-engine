import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum
} from 'nuqs/server';

export const deactivateStatusSearchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  hemicode: parseAsString,
  status: parseAsString,
  sortBy: parseAsString,
  sortDirection: parseAsStringEnum(['asc', 'desc'])
};

export const deactivateStatusSearchParamsCache = createSearchParamsCache(
  deactivateStatusSearchParams
);
export const serializeDeactivateStatusParams = createSerializer(
  deactivateStatusSearchParams
);
