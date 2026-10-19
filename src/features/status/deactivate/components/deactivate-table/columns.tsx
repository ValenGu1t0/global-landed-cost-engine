'use client';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { ProductTable } from '@/db/schema';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<ProductTable>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className='flex w-full justify-center'>
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          className='cursor-pointer'
          aria-label='Select All'
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex w-full justify-center'>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          className='cursor-pointer'
          aria-label='Select Row'
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    maxSize: 40
  },
  {
    accessorKey: 'cn_code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='CN-Code' pin={false} />
    ),
    size: 100,
    enableHiding: false
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' pin={false} />
    ),
    cell: ({ row }) => {
      const status = row.getValue<ProductTable['status']>('status');

      let variant:
        | 'default'
        | 'project'
        | 'sourcing'
        | 'destructive'
        | 'warning'
        | 'outline' = 'outline';

      if (status === 'ACTIVE') {
        variant = 'default';
      } else if (status === 'PROJECT') {
        variant = 'project';
      } else if (status === 'GS') {
        variant = 'sourcing';
      } else if (status === 'INACTIVE') {
        variant = 'destructive';
      }

      return (
        <Badge variant={variant} className='capitalize'>
          {status}
        </Badge>
      );
    },
    size: 90
  }
];
