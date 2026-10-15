'use client';

import { Table, VisibilityState } from '@tanstack/react-table';
import { ProductsViewTable } from '@/db/schema';
import { COLUMN_GROUPS } from '@/constants/column-groups';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Settings2 } from 'lucide-react';

interface ColumnGroupsDropdownProps {
  table: Table<ProductsViewTable>;
}

export function ColumnGroupsDropdown({ table }: ColumnGroupsDropdownProps) {
  const visibility = table.getState().columnVisibility;

  // Función para alternar la visibilidad de un grupo completo
  const toggleGroup = (groupKey: keyof typeof COLUMN_GROUPS) => {
    const group = COLUMN_GROUPS[groupKey];

    const isAnyColumnVisible = group.columns.some((colId) => visibility[colId]);

    const newState = !isAnyColumnVisible;

    const updates: VisibilityState = Object.fromEntries(
      group.columns.map((colId) => [colId, newState])
    );

    table.setColumnVisibility((prev: VisibilityState) => ({
      ...prev,
      ...updates
    }));
  };

  // Función para determinar si el checkbox debe estar marcado (true) o no (false).
  const getCheckedState = (
    groupKey: keyof typeof COLUMN_GROUPS
  ): boolean | 'indeterminate' => {
    const group = COLUMN_GROUPS[groupKey];
    const visibleCount = group.columns.filter(
      (colId) => visibility[colId]
    ).length;

    if (visibleCount === 0) {
      return false;
    }
    if (visibleCount === group.columns.length) {
      return true;
    }
    return 'indeterminate';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='ml-auto h-8'>
          <Settings2 className='mr-2 h-4 w-4' />
          See Column Groups
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-[200px]'>
        <DropdownMenuLabel>Change Groups</DropdownMenuLabel>

        <DropdownMenuSeparator />

        {Object.entries(COLUMN_GROUPS).map(([key, group]) => (
          <DropdownMenuCheckboxItem
            key={key}
            checked={getCheckedState(key as keyof typeof COLUMN_GROUPS)}
            onCheckedChange={() =>
              toggleGroup(key as keyof typeof COLUMN_GROUPS)
            }
            className='capitalize'
          >
            {group.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
