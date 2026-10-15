import {
  createSearchParamsCache,
  createSerializer,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum
} from 'nuqs/server';

export const activateStatusSearchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),

  hemicode: parseAsString,

  status: parseAsArrayOf(parseAsStringEnum(['INACTIVE', 'PROJECT', 'GS'])),

  sortBy: parseAsString,
  sortDirection: parseAsStringEnum(['asc', 'desc'])
};

export const activateStatusSearchParamsCache = createSearchParamsCache(
  activateStatusSearchParams
);
export const serializeActivateStatusParams = createSerializer(
  activateStatusSearchParams
);
