'use client';

import React, { useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import NiceModal from '@ebay/nice-modal-react';
import { IconFileImport, IconPlus, IconBolt } from '@tabler/icons-react';
import Link from 'next/link';
import { ProductsActiveBulkAddModal } from './products-active-bulk-add-modal';
import { ProductsInactiveBulkAddModal } from './products-inactive-bulk-add-modal';
import { ProductsProjectBulkAddModal } from './products-project-bulk-add-modal';
import { ProductsGSBulkAddModal } from './products-gs-bulk-add-modal';
import { LandedCostEngineModal } from './landed-cost-engine-modal';

export function ProductsViewActions() {
  const [isEngineOpen, setIsEngineOpen] = useState(false);

  const openActive = () => NiceModal.show(ProductsActiveBulkAddModal);
  const openProject = () => NiceModal.show(ProductsProjectBulkAddModal);
  const openInactive = () => NiceModal.show(ProductsInactiveBulkAddModal);
  const openGS = () => NiceModal.show(ProductsGSBulkAddModal);

  return (
    <>
      <div className='flex flex-wrap items-center gap-2'>
        {/* Run Landed Cost Engine Button */}
        <Button
          variant='outline'
          onClick={() => setIsEngineOpen(true)}
          className='border-amber-500/40 bg-amber-500/10 text-xs font-semibold text-amber-600 hover:bg-amber-500/20 hover:text-amber-700 md:text-sm dark:text-amber-400 dark:hover:text-amber-300'
        >
          <IconBolt className='mr-1.5 h-4 w-4' /> Run Calculation Engine
        </Button>

        {/* Dropdown para Bulk Add */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='text-xs md:text-sm'>
              <IconFileImport className='mr-2 h-4 w-4' /> Bulk Add
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-48'>
            <DropdownMenuItem onSelect={openActive}>
              Bulk Active
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={openInactive}>
              Bulk Inactive
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={openProject}>
              Bulk Project
            </DropdownMenuItem>
            <DropdownMenuItem className='cursor-pointer' onSelect={openGS}>
              Bulk Global Sourcing
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Add new product */}
        <Link
          href='/dashboard/products_view/new'
          className={cn(buttonVariants(), 'text-xs md:text-sm')}
        >
          <IconPlus className='mr-2 h-4 w-4' /> Add New Product
        </Link>
      </div>

      <LandedCostEngineModal
        open={isEngineOpen}
        onOpenChange={setIsEngineOpen}
      />
    </>
  );
}
