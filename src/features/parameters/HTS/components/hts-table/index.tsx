'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

interface HTSTableParams<TData, TValue> {
  data: TData[];
  totalHTSCodes: number;
  columns: ColumnDef<TData, TValue>[];
}

export function HTSTable<TData, TValue>({
  data,
  totalHTSCodes,
  columns
}: HTSTableParams<TData, TValue>) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const pageCount = Math.ceil(totalHTSCodes / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false,
    debounceMs: 500
  });

  return <DataTable table={table} totalItems={totalHTSCodes} />;
}
