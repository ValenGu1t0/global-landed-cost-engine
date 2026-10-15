'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

interface PortCostTableParams<TData, TValue> {
  data: TData[];
  totalPortCosts: number;
  columns: ColumnDef<TData, TValue>[];
}

export function PortCostTable<TData, TValue>({
  data,
  totalPortCosts,
  columns
}: PortCostTableParams<TData, TValue>) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const pageCount = Math.ceil(totalPortCosts / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false,
    debounceMs: 500
  });

  return <DataTable table={table} totalItems={totalPortCosts} />;
}
