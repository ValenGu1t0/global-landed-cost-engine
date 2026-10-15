'use client';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { DutiesCommercialAgreements } from '@/db/schema';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { CellAction } from './cell-action';

export const columns: ColumnDef<DutiesCommercialAgreements>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: ({
      column
    }: {
      column: Column<DutiesCommercialAgreements, unknown>;
    }) => <DataTableColumnHeader column={column} title='ID' pin />
  },
  {
    id: 'origin_country',
    accessorKey: 'origin_country',
    header: ({
      column
    }: {
      column: Column<DutiesCommercialAgreements, unknown>;
    }) => <DataTableColumnHeader column={column} title='Origin Country' pin />,
    cell: ({ cell }) => <span>{cell.getValue() as String}</span>
  },
  {
    id: 'destination_country',
    accessorKey: 'destination_country',
    header: ({
      column
    }: {
      column: Column<DutiesCommercialAgreements, unknown>;
    }) => (
      <DataTableColumnHeader column={column} title='Destination Country' pin />
    ),
    cell: ({ cell }) => <span>{cell.getValue() as String}</span>
  },

  {
    id: 'raw_material',
    accessorKey: 'raw_material',
    header: ({
      column
    }: {
      column: Column<DutiesCommercialAgreements, unknown>;
    }) => <DataTableColumnHeader column={column} title='Raw Material' pin />,
    cell: ({ cell }) => <span>{cell.getValue() as String}</span>
  },
  {
    id: 'cost_group',
    accessorKey: 'cost_group',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Cost Group' pin />
    ),
    cell: ({ cell }) => {
      const value = cell.getValue() as string | null;
      if (!value) return <span className='text-muted-foreground'>N/A</span>;

      return <Badge variant='outline'>{value}</Badge>;
    }
  },
  {
    id: 'start_date',
    accessorKey: 'start_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Start Date' pin />
    ),
    cell: ({ cell }) => {
      const date = cell.getValue() as string | null;
      if (!date) return '—';
      return new Date(date).toLocaleDateString();
    }
  },
  {
    id: 'end_date',
    accessorKey: 'end_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='End Date' pin />
    ),
    cell: ({ cell }) => {
      const raw = cell.getValue<DutiesCommercialAgreements['end_date']>();

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
    id: 'user',
    accessorKey: 'user',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User' pin />
    ),
    cell: ({ cell }) => {
      const value = cell.getValue() as string | null;
      return value || <span className='text-muted-foreground'>N/A</span>;
    }
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
