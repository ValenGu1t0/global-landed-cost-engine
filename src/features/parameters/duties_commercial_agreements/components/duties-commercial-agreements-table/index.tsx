'use client';

import { DataTable } from '@/components/ui/table/data-table';
/* import { ProductTableActions } from './table-actions'; */
import { useDataTable } from '@/hooks/use-data-table';
import { DutiesCommercialAgreements } from '@/db/schema';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

interface DutiesCommercialAgreementsTableParams<TValue> {
  data: DutiesCommercialAgreements[];
  totalItems: number;
  columns: ColumnDef<DutiesCommercialAgreements, TValue>[];
}

export function DutiesCommercialAgreementsTable<TValue>({
  data,
  totalItems,
  columns
}: DutiesCommercialAgreementsTableParams<TValue>) {
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
      /* tableActions={
        <ProductTableActions table={table} totalItems={totalItems} />
      } */
      /* Llamaria a un table-actions, el cual fue eliminado hasta que se sepa que hacer */
    />
  );
}
