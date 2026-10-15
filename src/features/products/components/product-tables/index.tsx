'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { ProductTableActions } from './table-actions';

import { useDataTable } from '@/hooks/use-data-table';

import { Product } from '@/db/schema';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

interface ProductTableParams<TValue> {
  data: Product[];
  totalItems: number;
  columns: ColumnDef<Product, TValue>[];
}

export function ProductTable<TValue>({
  data,
  totalItems,
  columns
}: ProductTableParams<TValue>) {
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
        <ProductTableActions table={table} totalItems={totalItems} />
      }
    />
  );
}
