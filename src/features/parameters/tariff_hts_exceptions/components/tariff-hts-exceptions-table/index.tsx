'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

interface TariffHTSExceptionsTableParams<TData, TValue> {
  data: TData[];
  totalTariffHTSException: number;
  columns: ColumnDef<TData, TValue>[];
}

export function TariffHTSExceptionsTable<TData, TValue>({
  data,
  totalTariffHTSException,
  columns
}: TariffHTSExceptionsTableParams<TData, TValue>) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const pageCount = Math.ceil(totalTariffHTSException / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false,
    debounceMs: 500
  });

  return <DataTable table={table} totalItems={totalTariffHTSException} />;
}
