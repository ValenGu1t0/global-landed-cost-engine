'use client';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { GroundFreight } from '@/db/schema';
import { CellAction } from './cell-actions';

export const columns: ColumnDef<GroundFreight>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: ({ column }: { column: Column<GroundFreight, unknown> }) => (
      <DataTableColumnHeader column={column} title='ID' pin />
    ),
    cell: ({ cell }) => <div>{cell.getValue<GroundFreight['id']>()}</div>
  },
  {
    id: 'vendor',
    accessorKey: 'vendor',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Vendor' pin />
    ),
    cell: ({ cell }) => <div>{cell.getValue<GroundFreight['vendor']>()}</div>
  },
  {
    id: 'factory_name',
    accessorKey: 'factory_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Factory Name' pin />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<GroundFreight['factory_name']>()}</div>
    )
  },
  {
    id: 'origin_country',
    accessorKey: 'origin_country',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Origin Country' pin />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<GroundFreight['origin_country']>()}</div>
    )
  },
  {
    id: 'destination_country',
    accessorKey: 'destination_country',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Destination Country' pin />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<GroundFreight['destination_country']>()}</div>
    )
  },
  {
    id: 'destination_warehouse',
    accessorKey: 'destination_warehouse',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Destination Warehouse'
        pin
      />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<GroundFreight['destination_warehouse']>()}</div>
    )
  },
  {
    id: 'container_type',
    accessorKey: 'container_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Container Type' pin />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<GroundFreight['container_type']>()}</div>
    )
  },
  {
    id: 'cost_detail',
    accessorKey: 'cost_detail',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Cost Detail' pin />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<GroundFreight['cost_detail']>()}</div>
    )
  },
  {
    id: 'value',
    accessorKey: 'value',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Value' pin />
    ),
    cell: ({ cell }) => {
      const val = cell.getValue<GroundFreight['value']>();
      return <div>{val != null ? val.toLocaleString() : ''}</div>;
    }
  },
  {
    id: 'start_date',
    accessorKey: 'start_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Start Date' pin />
    ),
    cell: ({ cell }) => {
      const value = cell.getValue<GroundFreight['start_date']>();
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
      const raw = cell.getValue<GroundFreight['end_date']>();
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
    id: 'cost_group',
    accessorKey: 'cost_group',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Cost Group' pin />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<GroundFreight['cost_group']>()}</div>
    )
  },
  {
    id: 'user',
    accessorKey: 'user',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User' pin />
    ),
    cell: ({ cell }) => <div>{cell.getValue<GroundFreight['user']>()}</div>
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
