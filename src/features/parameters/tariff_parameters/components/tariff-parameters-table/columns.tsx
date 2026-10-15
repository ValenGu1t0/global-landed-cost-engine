'use client';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { TariffParameters } from '@/db/schema';
import { CellAction } from './cell-actions';

export const columns: ColumnDef<TariffParameters>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: ({ column }: { column: Column<TariffParameters, unknown> }) => (
      <DataTableColumnHeader column={column} title='ID' pin />
    ),
    cell: ({ cell }) => <div>{cell.getValue<TariffParameters['id']>()}</div>
  },
  {
    id: 'origin_country',
    accessorKey: 'origin_country',
    header: ({ column }: { column: Column<TariffParameters, unknown> }) => (
      <DataTableColumnHeader column={column} title='Origin Country' pin />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<TariffParameters['origin_country']>() ?? '—'}</div>
    )
  },
  {
    id: 'destination_country',
    accessorKey: 'destination_country',
    header: ({ column }: { column: Column<TariffParameters, unknown> }) => (
      <DataTableColumnHeader column={column} title='Destination Country' pin />
    ),
    cell: ({ cell }) => (
      <div>
        {cell.getValue<TariffParameters['destination_country']>() ?? '—'}
      </div>
    )
  },
  {
    id: 'value',
    accessorKey: 'value',
    header: ({ column }: { column: Column<TariffParameters, unknown> }) => (
      <DataTableColumnHeader column={column} title='Value' pin />
    ),
    cell: ({ cell }) => {
      const v = cell.getValue<TariffParameters['value']>();
      return <div>{v != null ? v.toLocaleString() : '—'}</div>;
    }
  },
  {
    id: 'cost_group',
    accessorKey: 'cost_group',
    header: ({ column }: { column: Column<TariffParameters, unknown> }) => (
      <DataTableColumnHeader column={column} title='Cost Group' pin />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<TariffParameters['cost_group']>() ?? '—'}</div>
    )
  },
  {
    id: 'duty_dependent',
    accessorKey: 'duty_dependent',
    header: ({ column }: { column: Column<TariffParameters, unknown> }) => (
      <DataTableColumnHeader column={column} title='Duty Dependent' pin />
    ),
    cell: ({ cell }) => {
      const v = cell.getValue<TariffParameters['duty_dependent']>();
      if (v == null) return <div className='text-gray-400'>—</div>;
      return <div>{v ? 'Yes' : 'No'}</div>;
    }
  },
  {
    id: 'start_date',
    accessorKey: 'start_date',
    header: ({ column }: { column: Column<TariffParameters, unknown> }) => (
      <DataTableColumnHeader column={column} title='Start Date' pin />
    ),
    cell: ({ cell }) => {
      const raw = cell.getValue<TariffParameters['start_date']>();
      if (!raw) return <span className='text-gray-400'>—</span>;
      return <div>{new Date(raw).toLocaleDateString('es-AR')}</div>;
    }
  },
  {
    id: 'end_date',
    accessorKey: 'end_date',
    header: ({ column }: { column: Column<TariffParameters, unknown> }) => (
      <DataTableColumnHeader column={column} title='End Date' pin />
    ),
    cell: ({ cell }) => {
      const raw = cell.getValue<TariffParameters['end_date']>();
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
    header: ({ column }: { column: Column<TariffParameters, unknown> }) => (
      <DataTableColumnHeader column={column} title='User' pin />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<TariffParameters['user']>() ?? '—'}</div>
    )
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
        return <span className='text-xs text-gray-400 italic'></span>;
      }

      return <CellAction data={data} />;
    }
  }
];
