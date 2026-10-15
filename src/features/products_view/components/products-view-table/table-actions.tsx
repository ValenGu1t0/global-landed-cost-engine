'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Download, Loader2, MoreHorizontal } from 'lucide-react';
import { ProductsViewTable } from '@/db/schema';
import { Table } from '@tanstack/react-table';
import { useMutation } from '@tanstack/react-query';
import { resolveActionResult } from '@/lib/actions/client';
import { toast } from 'sonner';
import { useQueryStates } from 'nuqs';
import { productsViewSearchParams } from '../../searchparams';
import { downloadFromBase64 } from '@/lib/base64';
import { DownloadProductsViewSchema } from '../../actions/download-products-view-schema';
import { downloadProducts } from '../../actions/download-products-view';
import { ColumnGroupsDropdown } from './column-groups-dropdown';

interface ProductsViewTableActionsProps {
  table: Table<ProductsViewTable>;
  totalItems: number;
}

export function ProductsViewTableActions({
  table,
  totalItems
}: ProductsViewTableActionsProps) {
  const [searchParams] = useQueryStates(productsViewSearchParams);
  const {
    name: search,
    category,
    sortBy,
    sortDirection,
    stock,
    vendor,
    brand_name,
    consumer_use,
    product_collection,
    raw_material,
    season,
    set_collection,
    status
  } = searchParams;

  const selectedProductsIds = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original.tech_sku_id);

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
    mutationFn: async (input: DownloadProductsViewSchema) => {
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
      sortDirection: sortDirection || undefined,

      stock: stock || undefined,
      vendor: vendor || undefined,
      brand_name: brand_name || undefined,
      consumer_use: consumer_use || undefined,
      product_collection: product_collection || undefined,
      raw_material: raw_material || undefined,
      season: season || undefined,
      set_collection: set_collection || undefined,
      status: status || undefined
    });
  };

  return (
    <div className='flex items-center gap-2'>
      <ColumnGroupsDropdown table={table} />

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
          <DropdownMenuItem
            onClick={() => handleDownload()}
            disabled={isPending}
          >
            <Download className='mr-2 h-4 w-4' />
            Download all ({totalItems})
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
