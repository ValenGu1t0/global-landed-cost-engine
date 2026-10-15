'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

interface GroundFreightTableParams<GroundFreight, TValue> {
  data: GroundFreight[];
  totalGroundFreights: number;
  columns: ColumnDef<GroundFreight, TValue>[];
}

export function GroundFreightTable<GroundFreight, TValue>({
  data,
  totalGroundFreights,
  columns
}: GroundFreightTableParams<GroundFreight, TValue>) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const pageCount = Math.ceil(totalGroundFreights / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false,
    debounceMs: 500
  });

  return <DataTable table={table} totalItems={totalGroundFreights} />;
}
