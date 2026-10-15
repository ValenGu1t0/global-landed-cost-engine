import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

export default function ProductListSkeleton() {
  return <DataTableSkeleton columnCount={5} rowCount={8} withTableActions />;
}
