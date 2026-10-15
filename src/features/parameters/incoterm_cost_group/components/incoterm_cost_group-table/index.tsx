'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

interface IncotermCostGroupTableParams<TData, TValue> {
  data: TData[];
  totalIncotermCostGroupCodes: number;
  columns: ColumnDef<TData, TValue>[];
}

export function IncotermCostGroupTable<TData, TValue>({
  data,
  totalIncotermCostGroupCodes,
  columns
}: IncotermCostGroupTableParams<TData, TValue>) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const pageCount = Math.ceil(totalIncotermCostGroupCodes / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false,
    debounceMs: 500
  });

  return <DataTable table={table} totalItems={totalIncotermCostGroupCodes} />;
}
