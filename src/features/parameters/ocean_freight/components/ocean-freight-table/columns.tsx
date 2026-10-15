'use client';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { OceanFreight } from '@/db/schema';
import { CellAction } from './cell-actions';

export const columns: ColumnDef<OceanFreight>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: ({ column }: { column: Column<OceanFreight, unknown> }) => (
      <DataTableColumnHeader column={column} title='ID' pin />
    ),
    cell: ({ cell }) => <div>{cell.getValue<OceanFreight['id']>()}</div>
  },
  {
    id: 'origin_port',
    accessorKey: 'origin_port',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Origin Port' pin />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<OceanFreight['origin_port']>()}</div>
    )
  },
  {
    id: 'origin_country',
    accessorKey: 'origin_country',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Origin Country' pin />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<OceanFreight['origin_country']>()}</div>
    )
  },
  {
    id: 'destination_port',
    accessorKey: 'destination_port',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Destination Port' pin />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<OceanFreight['destination_port']>()}</div>
    )
  },
  {
    id: 'destination_country',
    accessorKey: 'destination_country',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Destination Country' pin />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<OceanFreight['destination_country']>()}</div>
    )
  },
  {
    id: 'container_type',
    accessorKey: 'container_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Container Type' pin />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<OceanFreight['container_type']>()}</div>
    )
  },
  {
    id: 'value',
    accessorKey: 'value',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Value' pin />
    ),
    cell: ({ cell }) => {
      const v = cell.getValue<OceanFreight['value']>();
      return <div>{v != null ? v.toLocaleString() : ''}</div>;
    }
  },
  {
    id: 'cost_group',
    accessorKey: 'cost_group',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Cost Group' pin />
    ),
    cell: ({ cell }) => <div>{cell.getValue<OceanFreight['cost_group']>()}</div>
  },
  {
    id: 'start_date',
    accessorKey: 'start_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Start Date' pin />
    ),
    cell: ({ cell }) => {
      const value = cell.getValue<OceanFreight['start_date']>();
      if (!value) return <span className='text-gray-400'>—</span>;
      return <div>{new Date(value).toLocaleDateString('es-AR')}</div>;
    }
  },
  {
    id: 'end_date',
    accessorKey: 'end_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='End Date' pin />
    ),
    cell: ({ cell }) => {
      const raw = cell.getValue<OceanFreight['end_date']>();
      if (!raw) return <span className='text-gray-400'>—</span>;

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
    id: 'user',
    accessorKey: 'user',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User' pin />
    ),
    cell: ({ cell }) => <div>{cell.getValue<OceanFreight['user']>()}</div>
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
