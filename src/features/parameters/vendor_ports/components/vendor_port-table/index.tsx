'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

interface VendorPortTableParams<TData, TValue> {
  data: TData[];
  totalVendorPorts: number;
  columns: ColumnDef<TData, TValue>[];
}

export function VendorPortTable<TData, TValue>({
  data,
  totalVendorPorts,
  columns
}: VendorPortTableParams<TData, TValue>) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalVendorPorts / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false,
    debounceMs: 500
  });

  return <DataTable table={table} totalItems={totalVendorPorts} />;
}
