'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

interface OceanFreightTableParams<TData, TValue> {
  data: TData[];
  totalOceanFreights: number;
  columns: ColumnDef<TData, TValue>[];
}

export function OceanFreightTable<TData, TValue>({
  data,
  totalOceanFreights,
  columns
}: OceanFreightTableParams<TData, TValue>) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalOceanFreights / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false,
    debounceMs: 500
  });

  return <DataTable table={table} totalItems={totalOceanFreights} />;
}
