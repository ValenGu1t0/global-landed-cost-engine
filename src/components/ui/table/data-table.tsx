import { type Table as TanstackTable, flexRender } from '@tanstack/react-table';
import type * as React from 'react';

import { DataTablePagination } from '@/components/ui/table/data-table-pagination';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { getCommonPinningStyles } from '@/lib/data-table';
import { cn } from '@/lib/utils';
import { DataTableViewOptions } from './data-table-view-options';

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
  table: TanstackTable<TData>;
  totalItems?: number;
  tableActions?: React.ReactNode;
}

export function DataTable<TData>({
  table,
  totalItems,
  tableActions
}: DataTableProps<TData>) {
  return (
    <div className='relative flex h-full min-h-0 min-w-0 flex-1 flex-col gap-4'>
      {tableActions ? (
        <div className='flex shrink-0 items-center justify-between gap-2'>
          {tableActions}
          <DataTableViewOptions table={table} />
        </div>
      ) : (
        <div className='absolute -top-[3.25rem] right-0 z-10 flex h-9 items-center gap-2'>
          <DataTableViewOptions table={table} />
        </div>
      )}

      <div className='min-h-0 w-full min-w-0 flex-1 overflow-x-auto overflow-y-auto rounded-lg border'>
        <table className='w-full caption-bottom text-sm'>
          <TableHeader className='bg-background sticky top-0 z-10'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className='bg-muted hover:bg-muted border-b'
              >
                {headerGroup.headers.map((header) => {
                  const isPinned = header.column.getIsPinned();
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        'bg-muted relative overflow-hidden text-ellipsis select-none',
                        isPinned && 'bg-muted sticky z-20'
                      )}
                      style={{
                        ...getCommonPinningStyles({ column: header.column }),
                        zIndex: isPinned ? 25 : 10
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          onDoubleClick={() => header.column.resetSize()}
                          className={cn(
                            'hover:bg-primary absolute top-0 right-0 z-30 h-full w-1.5 cursor-col-resize touch-none transition-colors select-none',
                            header.column.getIsResizing()
                              ? 'bg-primary'
                              : 'bg-transparent'
                          )}
                        />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='group hover:bg-muted data-[state=selected]:bg-muted'
                >
                  {row.getVisibleCells().map((cell) => {
                    const isPinned = cell.column.getIsPinned();
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          'bg-background group-hover:bg-muted group-data-[state=selected]:bg-muted overflow-hidden text-ellipsis transition-colors',
                          isPinned && 'sticky'
                        )}
                        style={{
                          ...getCommonPinningStyles({ column: cell.column })
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </table>
      </div>

      <div className='flex shrink-0 flex-col gap-2.5'>
        <DataTablePagination table={table} totalItems={totalItems} />
      </div>
    </div>
  );
}
