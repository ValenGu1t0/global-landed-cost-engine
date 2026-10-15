'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { OtherParameter } from '@/db/schema';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<OtherParameter>[] = [
  {
    id: 'parameter',
    accessorKey: 'parameter',
    header: ({ column }: { column: Column<OtherParameter, unknown> }) => (
      <DataTableColumnHeader column={column} title='Parameter' pin />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<OtherParameter['parameter']>()}</div>
    )
  },
  {
    id: 'value',
    accessorKey: 'value',
    header: ({ column }: { column: Column<OtherParameter, unknown> }) => (
      <DataTableColumnHeader column={column} title='Value' pin />
    ),
    cell: ({ cell }) => <div>{cell.getValue<OtherParameter['value']>()}</div>
  },
  {
    id: 'cost_group',
    accessorKey: 'cost_group',
    header: ({ column }: { column: Column<OtherParameter, unknown> }) => (
      <DataTableColumnHeader column={column} title='Cost Group' pin />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<OtherParameter['cost_group']>()}</div>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
