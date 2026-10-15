'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

interface InlandParameterTableParams<TData, TValue> {
  data: TData[];
  totalInlandParameters: number;
  columns: ColumnDef<TData, TValue>[];
}

export function InlandParameterTable<TData, TValue>({
  data,
  totalInlandParameters,
  columns
}: InlandParameterTableParams<TData, TValue>) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalInlandParameters / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false,
    debounceMs: 500
  });

  return <DataTable table={table} totalItems={totalInlandParameters} />;
}
