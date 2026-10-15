'use client';

import type { Column } from '@tanstack/react-table';
import { EyeOff, Pin, PinOff } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CaretSortIcon,
  Cross2Icon
} from '@radix-ui/react-icons';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.ComponentProps<typeof DropdownMenuTrigger> {
  column: Column<TData, TValue>;
  title: string;
  pin: boolean;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  pin = false,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className='bg-muted z-50 flex flex-row px-1'>
      {/* Dropdown de opciones */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            'hover:bg-accent focus:ring-ring data-[state=open]:bg-accent [&_svg]:text-muted-foreground -ml-1.5 flex h-8 items-center gap-1.5 rounded-md px-2 py-1.5 focus:ring-1 focus:outline-none [&_svg]:size-4 [&_svg]:shrink-0',
            className
          )}
          {...props}
        >
          {title}
          {column.getCanSort() &&
            (column.getIsSorted() === 'desc' ? (
              <ChevronDownIcon />
            ) : column.getIsSorted() === 'asc' ? (
              <ChevronUpIcon />
            ) : (
              <CaretSortIcon />
            ))}
        </DropdownMenuTrigger>

        <DropdownMenuContent align='start' className='w-28'>
          {column.getCanSort() && (
            <>
              <DropdownMenuCheckboxItem
                className='[&_svg]:text-muted-foreground relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto'
                checked={column.getIsSorted() === 'asc'}
                onClick={() => column.toggleSorting(false)}
              >
                <ChevronUpIcon />
                Asc
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                className='[&_svg]:text-muted-foreground relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto'
                checked={column.getIsSorted() === 'desc'}
                onClick={() => column.toggleSorting(true)}
              >
                <ChevronDownIcon />
                Desc
              </DropdownMenuCheckboxItem>
              {column.getIsSorted() && (
                <DropdownMenuItem
                  className='[&_svg]:text-muted-foreground pl-2'
                  onClick={() => column.clearSorting()}
                >
                  <Cross2Icon />
                  Reset
                </DropdownMenuItem>
              )}
            </>
          )}
          {column.getCanHide() && (
            <DropdownMenuCheckboxItem
              className='[&_svg]:text-muted-foreground relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto'
              checked={!column.getIsVisible()}
              onClick={() => column.toggleVisibility(false)}
            >
              <EyeOff />
              Hide
            </DropdownMenuCheckboxItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Pin */}
      {pin && (
        <button
          className='text-muted-foreground hover:text-foreground ml-2 cursor-pointer transition'
          onClick={(e) => {
            e.stopPropagation();
            column.getIsPinned() ? column.pin(false) : column.pin('left');
          }}
        >
          {column.getIsPinned() ? (
            <PinOff className='h-4 w-4' />
          ) : (
            <Pin className='h-4 w-4' />
          )}
        </button>
      )}
    </div>
  );
}
