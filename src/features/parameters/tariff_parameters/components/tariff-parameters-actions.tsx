'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';

export default function TariffParametersActions() {
  return (
    <div className='flex gap-2'>
      <Link
        href='/dashboard/parameters/tariff_parameters/new'
        className={cn(buttonVariants(), 'text-xs md:text-sm')}
      >
        <IconPlus className='mr-2 h-4 w-4' /> Add Tariff Parameter
      </Link>
    </div>
  );
}
