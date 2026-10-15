'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';

export default function InlandParameterActions() {
  return (
    <div className='flex gap-2'>
      <Link
        href='/dashboard/parameters/inland_parameter/new'
        className={cn(buttonVariants(), 'text-xs md:text-sm')}
      >
        <IconPlus className='mr-2 h-4 w-4' /> Add Inland Parameter
      </Link>
    </div>
  );
}
