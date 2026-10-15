'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Loader2, MoreHorizontal, XCircle } from 'lucide-react';
import { ProductTable } from '@/db/schema';
import { Table } from '@tanstack/react-table';
import { useMutation } from '@tanstack/react-query';
import { resolveActionResult } from '@/lib/actions/client';
import { toast } from 'sonner';
import { bulkActivateStatus } from '../../actions/bulk-activate-status';

interface ActivateTableActionsProps {
  table: Table<ProductTable>;
  totalItems: number;
}

export function ActivateTableActions({
  table,
  totalItems
}: ActivateTableActionsProps) {
  const [errorList, setErrorList] = useState<string[] | null>(null);

  const selectedProductsIds = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original.tech_sku_id);

  const hasSelection = selectedProductsIds.length > 0;

  const { mutate: activate, isPending } = useMutation({
    mutationFn: async (input: { tech_sku_id: number[]; status: 'ACTIVE' }) =>
      resolveActionResult(bulkActivateStatus(input)),

    onSuccess: (data) => {
      if (data?.errors?.length > 0) {
        setErrorList(data.errors);
        return;
      }

      toast.success(data.message);
      table.resetRowSelection();
    },

    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleActivateSelected = () => {
    if (!hasSelection) {
      toast.error('No products selected');
      return;
    }

    activate({
      tech_sku_id: selectedProductsIds,
      status: 'ACTIVE'
    });
  };

  return (
    <>
      {/* ACTIONS DROPDOWN */}
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
              onClick={handleActivateSelected}
              disabled={isPending}
              className='cursor-pointer'
            >
              <XCircle className='mr-2 h-4 w-4' />
              Set selected as ACTIVE ({selectedProductsIds.length})
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ERROR MODAL */}
      <Dialog open={!!errorList} onOpenChange={() => setErrorList(null)}>
        <DialogContent className='max-h-[80vh] max-w-lg overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Errors found while activating products</DialogTitle>
            <DialogDescription>
              Please review these issues before trying again.
            </DialogDescription>
          </DialogHeader>

          <ul className='ml-6 list-disc space-y-1 text-sm font-medium text-red-600'>
            {errorList?.map((err, i) => <li key={i}>{err}</li>)}
          </ul>

          <DialogFooter>
            <Button onClick={() => setErrorList(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
