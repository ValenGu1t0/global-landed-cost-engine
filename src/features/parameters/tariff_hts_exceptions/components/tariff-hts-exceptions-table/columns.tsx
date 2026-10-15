'use client';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { TariffHTSExceptionsTable } from '@/db/schema';
import { CellAction } from './cell-actions';

export const columns: ColumnDef<TariffHTSExceptionsTable>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: ({
      column
    }: {
      column: Column<TariffHTSExceptionsTable, unknown>;
    }) => <DataTableColumnHeader column={column} title='ID' pin />,
    cell: ({ cell }) => (
      <div>{cell.getValue<TariffHTSExceptionsTable['id']>()}</div>
    )
  },
  {
    id: 'hts_code',
    accessorKey: 'hts_code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='HTS Code' pin />
    ),
    cell: ({ cell }) => (
      <div>{cell.getValue<TariffHTSExceptionsTable['hts_code']>() ?? '—'}</div>
    )
  },
  {
    id: 'origin_country',
    accessorKey: 'origin_country',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Origin Country' pin />
    ),
    cell: ({ cell }) => (
      <div>
        {cell.getValue<TariffHTSExceptionsTable['origin_country']>() ?? '—'}
      </div>
    )
  },
  {
    id: 'destination_country',
    accessorKey: 'destination_country',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Destination Country' pin />
    ),
    cell: ({ cell }) => (
      <div>
        {cell.getValue<TariffHTSExceptionsTable['destination_country']>() ??
          '—'}
      </div>
    )
  },
  {
    id: 'special_tariff_value',
    accessorKey: 'special_tariff_value',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Special Tariff Value' pin />
    ),
    cell: ({ cell }) => {
      const v =
        cell.getValue<TariffHTSExceptionsTable['special_tariff_value']>();
      return <div>{v != null ? v.toLocaleString() : '—'}</div>;
    }
  },
  {
    id: 'cost_group',
    accessorKey: 'cost_group',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Cost Group' pin />
    ),
    cell: ({ cell }) => (
      <div>
        {cell.getValue<TariffHTSExceptionsTable['cost_group']>() ?? '—'}
      </div>
    )
  },
  {
    id: 'start_date',
    accessorKey: 'start_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Start Date' pin />
    ),
    cell: ({ cell }) => {
      const raw = cell.getValue<TariffHTSExceptionsTable['start_date']>();
      if (!raw) return <span className='text-gray-400'>—</span>;
      return <div>{new Date(raw).toLocaleDateString('es-AR')}</div>;
    }
  },
  {
    id: 'end_date',
    accessorKey: 'end_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='End Date' pin />
    ),
    cell: ({ cell }) => {
      const raw = cell.getValue<TariffHTSExceptionsTable['end_date']>();
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
    cell: ({ cell }) => (
      <div>{cell.getValue<TariffHTSExceptionsTable['user']>() ?? '—'}</div>
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
        return (
          <span className='text-xs text-gray-400 italic'>Not Editable</span>
        );
      }

      return <CellAction data={data} />;
    }
  }
];
