'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { IncotermCostGroup } from '@/db/schema';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<IncotermCostGroup>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: ({ column }: { column: Column<IncotermCostGroup, unknown> }) => (
      <DataTableColumnHeader column={column} title='ID' pin />
    ),
    cell: ({ cell }) => <div>{cell.getValue<IncotermCostGroup['id']>()}</div>
  },
  {
    id: 'cost_group',
    accessorKey: 'cost_group',
    header: ({ column }: { column: Column<IncotermCostGroup, unknown> }) => (
      <DataTableColumnHeader column={column} title='Cost Group' pin />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<IncotermCostGroup['cost_group']>()}</div>
    )
  },
  {
    id: 'vendor',
    accessorKey: 'vendor',
    header: ({ column }: { column: Column<IncotermCostGroup, unknown> }) => (
      <DataTableColumnHeader column={column} title='Vendor' pin />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<IncotermCostGroup['vendor']>()}</div>
    )
  },
  {
    id: 'country',
    accessorKey: 'country',
    header: ({ column }: { column: Column<IncotermCostGroup, unknown> }) => (
      <DataTableColumnHeader column={column} title='Country' pin />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<IncotermCostGroup['country']>()}</div>
    )
  },
  {
    id: 'incoterm',
    accessorKey: 'incoterm',
    header: ({ column }: { column: Column<IncotermCostGroup, unknown> }) => (
      <DataTableColumnHeader column={column} title='Incoterm' pin />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<IncotermCostGroup['incoterm']>()}</div>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
