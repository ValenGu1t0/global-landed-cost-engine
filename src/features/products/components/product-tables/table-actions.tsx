'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Download, Loader2, MoreHorizontal } from 'lucide-react';
import { Product } from '@/db/schema';
import { Table } from '@tanstack/react-table';
import { useMutation } from '@tanstack/react-query';
import { downloadProducts } from '../../actions/download-products';
import { resolveActionResult } from '@/lib/actions/client';
import { toast } from 'sonner';
import { useQueryStates } from 'nuqs';
import { productSearchParams } from '../../searchparams';
import { DownloadProductsSchema } from '../../actions/download-products-schema';
import { downloadFromBase64 } from '@/lib/base64';

interface ProductTableActionsProps {
  table: Table<Product>;
  totalItems: number;
}

export function ProductTableActions({
  table,
  totalItems
}: ProductTableActionsProps) {
  const [searchParams] = useQueryStates(productSearchParams);
  const { name: search, category, sortBy, sortDirection } = searchParams;

  const selectedProductsIds = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original.id);

  const hasSelection = selectedProductsIds.length > 0;

  const selectedColumnsIds = table
    .getAllColumns()
    .filter(
      (column) =>
        column.getIsVisible() &&
        column.id !== 'select' &&
        column.id !== 'actions'
    )
    .map((column) => column.id);

  const { mutate: download, isPending } = useMutation({
    mutationFn: async (input: DownloadProductsSchema) => {
      return resolveActionResult(downloadProducts(input));
    },
    onSuccess: (data) => {
      downloadFromBase64(data.base64, data.filename, data.mimeType);
      toast.success('Excel downloaded successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleDownload = (ids?: number[]) => {
    if (selectedColumnsIds.length === 0) {
      toast.error('You must have at least one visible column');
      return;
    }

    download({
      columns: selectedColumnsIds,
      ids,
      search: search || undefined,
      category: category || undefined,
      sortBy: sortBy || undefined,
      sortDirection: sortDirection || undefined
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
            onClick={() => handleDownload(selectedProductsIds)}
            disabled={isPending}
          >
            <Download className='mr-2 h-4 w-4' />
            Download selected ({selectedProductsIds.length})
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => handleDownload()} disabled={isPending}>
          <Download className='mr-2 h-4 w-4' />
          Download all ({totalItems})
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
