'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import NiceModal from '@ebay/nice-modal-react';
import { IconFileImport, IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { ProductBulkAddModal } from './product-bulk-add-modal';

export function ProductActions() {
  const showBulkAddModal = () => {
    NiceModal.show(ProductBulkAddModal);
  };

  return (
    <div className='flex gap-2'>
      <Button
        className={cn(buttonVariants(), 'text-xs md:text-sm')}
        onClick={showBulkAddModal}
      >
        <IconFileImport className='mr-2 h-4 w-4' /> Bulk Add
      </Button>
      <Link
        href='/dashboard/product/new'
        className={cn(buttonVariants(), 'text-xs md:text-sm')}
      >
        <IconPlus className='mr-2 h-4 w-4' /> Add New
      </Link>
    </div>
  );
}
