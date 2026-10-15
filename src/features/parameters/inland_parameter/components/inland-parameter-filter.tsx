'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { useQueryState } from 'nuqs';
import { inlandParameterSearchParams } from '@/features/parameters/inland_parameter/searchparams';
import { useTransitionContext } from '@/hooks/use-transition-context';
import { useDebouncedQueryState } from '@/hooks/use-debounced-query-state';

export function InlandParameterFilters() {
  const { startTransition } = useTransitionContext();

  const [search, setSearch] = useDebouncedQueryState(
    'search',
    inlandParameterSearchParams.search,
    {
      startTransition,
      shallow: false,
      debounceMs: 500
    }
  );

  const [page, setPage] = useQueryState(
    'page',
    inlandParameterSearchParams.page.withOptions({
      startTransition,
      shallow: false
    })
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value || null);

    if (page !== 1) {
      setPage(1);
    }
  };

  return (
    <div className='flex w-full items-center gap-2'>
      <div className='flex flex-1 flex-wrap items-center gap-2'>
        <Input
          placeholder='Search inland parameters...'
          value={search || ''}
          onChange={handleSearchChange}
          className='h-9 w-40 lg:w-56'
        />
      </div>
    </div>
  );
}
