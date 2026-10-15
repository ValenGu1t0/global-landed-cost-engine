'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Loader2, MoreHorizontal, XCircle } from 'lucide-react';
import { ProductTable } from '@/db/schema';
import { Table } from '@tanstack/react-table';
import { useMutation } from '@tanstack/react-query';
import { resolveActionResult } from '@/lib/actions/client';
import { toast } from 'sonner';
import { bulkDeactivateStatus } from '../../actions/bulk-deactivate-status';

interface DeactivateTableActionsProps {
  table: Table<ProductTable>;
  totalItems: number;
}

export function DeactivateTableActions({
  table,
  totalItems
}: DeactivateTableActionsProps) {
  const selectedProductsIds = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original.tech_sku_id);

  const hasSelection = selectedProductsIds.length > 0;

  const { mutate: deactivate, isPending } = useMutation({
    mutationFn: async (input: {
      tech_sku_id: number[];
      status: 'INACTIVE';
    }) => {
      return resolveActionResult(bulkDeactivateStatus(input));
    },
    onSuccess: (data) => {
      toast.success(`${data.message}`);
      table.resetRowSelection();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleDeactivateSelected = () => {
    if (!hasSelection) {
      toast.error('No products selected');
      return;
    }

    deactivate({
      tech_sku_id: selectedProductsIds,
      status: 'INACTIVE'
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='h-8'
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className='animate-spin' />
          ) : (
            <MoreHorizontal />
          )}
          Actions
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        {hasSelection && (
          <DropdownMenuItem
            onClick={handleDeactivateSelected}
            disabled={isPending}
            className='cursor-pointer'
          >
            <XCircle className='mr-2 h-4 w-4 cursor-pointer' />
            Set selected as INACTIVE ({selectedProductsIds.length})
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
