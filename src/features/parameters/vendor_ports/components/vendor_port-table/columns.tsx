'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { VendorPort } from '@/db/schema';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<VendorPort>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: ({ column }: { column: Column<VendorPort, unknown> }) => (
      <DataTableColumnHeader column={column} title='ID' pin />
    ),
    cell: ({ cell }) => <div>{cell.getValue<VendorPort['id']>()}</div>
  },
  {
    id: 'vendor',
    accessorKey: 'vendor',
    header: ({ column }: { column: Column<VendorPort, unknown> }) => (
      <DataTableColumnHeader column={column} title='Vendor' pin />
    ),
    cell: ({ cell }) => <div>{cell.getValue<VendorPort['vendor']>()}</div>
  },
  {
    id: 'country',
    accessorKey: 'country',
    header: ({ column }: { column: Column<VendorPort, unknown> }) => (
      <DataTableColumnHeader column={column} title='Country' pin />
    ),
    cell: ({ cell }) => <div>{cell.getValue<VendorPort['country']>()}</div>
  },
  {
    id: 'port',
    accessorKey: 'port',
    header: ({ column }: { column: Column<VendorPort, unknown> }) => (
      <DataTableColumnHeader column={column} title='Port' pin />
    ),
    cell: ({ cell }) => <div>{cell.getValue<VendorPort['port']>()}</div>
  },
  {
    id: 'main_port',
    accessorKey: 'main_port',
    header: ({ column }: { column: Column<VendorPort, unknown> }) => (
      <DataTableColumnHeader column={column} title='Main Port' pin />
    ),
    cell: ({ cell }) => {
      const value = cell.getValue<VendorPort['main_port']>();
      return <div>{value ? 'Yes' : 'No'}</div>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
