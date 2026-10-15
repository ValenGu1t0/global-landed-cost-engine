'use client';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import type { InlandParameter } from '@/db/schema';

export const columns: ColumnDef<InlandParameter>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: ({ column }: { column: Column<InlandParameter, unknown> }) => (
      <DataTableColumnHeader column={column} title='ID' pin />
    ),
    cell: ({ cell }) => <div>{cell.getValue<InlandParameter['id']>()}</div>
  },
  {
    id: 'inland_type',
    accessorKey: 'inland_type',
    header: ({ column }: { column: Column<InlandParameter, unknown> }) => (
      <DataTableColumnHeader column={column} title='Inland Type' pin />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<InlandParameter['inland_type']>()}</div>
    )
  },
  {
    id: 'port',
    accessorKey: 'port',
    header: ({ column }: { column: Column<InlandParameter, unknown> }) => (
      <DataTableColumnHeader column={column} title='Port' pin />
    ),
    cell: ({ cell }) => <div>{cell.getValue<InlandParameter['port']>()}</div>
  },
  {
    id: 'country',
    accessorKey: 'country',
    header: ({ column }: { column: Column<InlandParameter, unknown> }) => (
      <DataTableColumnHeader column={column} title='Country' pin />
    ),
    cell: ({ cell }) => <div>{cell.getValue<InlandParameter['country']>()}</div>
  },
  {
    id: 'start_date',
    accessorKey: 'start_date',
    header: ({ column }: { column: Column<InlandParameter, unknown> }) => (
      <DataTableColumnHeader column={column} title='Start Date' pin />
    ),
    cell: ({ cell }) => {
      const value = cell.getValue<InlandParameter['start_date']>();
      return <div>{new Date(value as string).toLocaleDateString()}</div>;
    }
  },
  {
    id: 'end_date',
    accessorKey: 'end_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='End Date' pin />
    ),
    cell: ({ cell }) => {
      const raw = cell.getValue<InlandParameter['end_date']>();

      if (!raw) {
        return <span className='text-gray-400'>—</span>;
      }

      const date = new Date(raw);
      const formatted = date.toLocaleDateString('es-AR');

      const isCurrent = date.getFullYear() === 2100;

      return (
        <span className={isCurrent ? 'text-green-500' : 'text-red-500'}>
          {formatted}
        </span>
      );
    }
  },
  {
    id: 'zip_code',
    accessorKey: 'zip_code',
    header: ({ column }: { column: Column<InlandParameter, unknown> }) => (
      <DataTableColumnHeader column={column} title='Zip Code' pin />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<InlandParameter['zip_code']>()}</div>
    )
  },
  {
    id: 'value',
    accessorKey: 'value',
    header: ({ column }: { column: Column<InlandParameter, unknown> }) => (
      <DataTableColumnHeader column={column} title='Value' pin />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<InlandParameter['value']>()?.toLocaleString()}</div>
    )
  },
  {
    id: 'cost_group',
    accessorKey: 'cost_group',
    header: ({ column }: { column: Column<InlandParameter, unknown> }) => (
      <DataTableColumnHeader column={column} title='Cost Group' pin />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<InlandParameter['cost_group']>()}</div>
    )
  },
  {
    id: 'user',
    accessorKey: 'user',
    header: ({ column }: { column: Column<InlandParameter, unknown> }) => (
      <DataTableColumnHeader column={column} title='User' pin />
    ),
    cell: ({ cell }) => <div>{cell.getValue<InlandParameter['user']>()}</div>
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const data = row.original;

      const editable =
        data.start_date &&
        data.end_date &&
        new Date(data.start_date).toDateString() ===
          new Date().toDateString() &&
        new Date(data.end_date).getFullYear() === 2100;

      if (!editable) {
        return (
          <span className='text-xs text-gray-400 italic'>Not Editable</span>
        );
      }

      return <CellAction data={data} />;
    }
  }
];
