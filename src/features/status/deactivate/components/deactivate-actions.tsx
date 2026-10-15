'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import NiceModal from '@ebay/nice-modal-react';
import { IconFileImport } from '@tabler/icons-react';
import { BulkDeactivationModal } from './bulk-deactivation-modal';

export function DeactivateStatusActions() {
  const openBulkDeactivation = () => NiceModal.show(BulkDeactivationModal);

  return (
    <div className='flex gap-2'>
      {/* Dropdown para Bulk Deactivate */}
      <Button
        onClick={openBulkDeactivation}
        className={cn(buttonVariants(), 'text-xs md:text-sm')}
      >
        <IconFileImport className='mr-2 h-4 w-4' /> Bulk Status Deactivate
      </Button>
    </div>
  );
}
