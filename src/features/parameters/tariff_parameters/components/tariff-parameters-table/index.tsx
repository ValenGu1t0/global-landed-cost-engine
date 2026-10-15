'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

interface TariffParametersTableParams<TData, TValue> {
  data: TData[];
  totalTariffParameters: number;
  columns: ColumnDef<TData, TValue>[];
}

export function TariffParametersTable<TData, TValue>({
  data,
  totalTariffParameters,
  columns
}: TariffParametersTableParams<TData, TValue>) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const pageCount = Math.ceil(totalTariffParameters / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false,
    debounceMs: 500
  });

  return <DataTable table={table} totalItems={totalTariffParameters} />;
}
