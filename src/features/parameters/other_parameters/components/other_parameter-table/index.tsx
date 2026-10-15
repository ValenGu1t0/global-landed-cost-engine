'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

interface OtherParameterTableParams<TData, TValue> {
  data: TData[];
  totalOtherParameters: number;
  columns: ColumnDef<TData, TValue>[];
}

export function OtherParameterTable<TData, TValue>({
  data,
  totalOtherParameters,
  columns
}: OtherParameterTableParams<TData, TValue>) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const pageCount = Math.ceil(totalOtherParameters / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false,
    debounceMs: 500
  });

  return <DataTable table={table} totalItems={totalOtherParameters} />;
}
