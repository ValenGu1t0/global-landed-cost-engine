import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import { Breadcrumbs } from '../breadcrumbs';
import { ThemeSelector } from '../theme-selector';

export default function Header() {
  return (
    <header className='flex h-16 w-full max-w-full min-w-0 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
      <div className='flex min-w-0 items-center gap-2 overflow-hidden px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Breadcrumbs />
      </div>

      <div className='flex shrink-0 items-center gap-2 px-4'>
        <ThemeSelector />
      </div>
    </header>
  );
}
