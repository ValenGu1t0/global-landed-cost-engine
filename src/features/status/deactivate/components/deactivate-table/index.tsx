'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DeactivateTableActions } from './table-actions';
import { useDataTable } from '@/hooks/use-data-table';
import { ProductTable } from '@/db/schema';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

interface ProductsViewTableParams<TValue> {
  data: ProductTable[];
  totalItems: number;
  columns: ColumnDef<ProductTable, TValue>[];
}

export function DeactivateTableComponent<TValue>({
  data,
  totalItems,
  columns
}: ProductsViewTableParams<TValue>) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false,
    debounceMs: 500
  });

  return (
    <DataTable
      table={table}
      totalItems={totalItems}
      tableActions={
        <DeactivateTableActions table={table} totalItems={totalItems} />
      }
    />
  );
}
