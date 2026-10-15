'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import NiceModal from '@ebay/nice-modal-react';
import { IconFileImport } from '@tabler/icons-react';
import { BulkActivationModal } from './bulk-activation-modal';

export function ActivateStatusActions() {
  const openBulkActivation = () => NiceModal.show(BulkActivationModal);

  return (
    <div className='flex gap-2'>
      {/* Dropdown para Bulk Active */}
      <Button
        onClick={openBulkActivation}
        className={cn(buttonVariants(), 'text-xs md:text-sm')}
      >
        <IconFileImport className='mr-2 h-4 w-4' /> Bulk Status Activate
      </Button>
    </div>
  );
}
