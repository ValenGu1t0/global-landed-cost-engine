'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useQueryState } from 'nuqs';
import { useTransitionContext } from '@/hooks/use-transition-context';
import { useDebouncedQueryState } from '@/hooks/use-debounced-query-state';
import { tariffParametersSearchParams } from '../searchparams';

export function TariffParametersFilters() {
  const { startTransition } = useTransitionContext();

  const [search, setSearch] = useDebouncedQueryState(
    'search',
    tariffParametersSearchParams.search,
    {
      startTransition,
      shallow: false,
      debounceMs: 500
    }
  );

  // Paginación estándar
  const [page, setPage] = useQueryState(
    'page',
    tariffParametersSearchParams.page.withOptions({
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

  const handleResetFilters = () => {
    setSearch(null);
    setPage(1);
  };

  const hasActiveFilters = search !== null;

  return (
    <div className='flex w-full items-center gap-2'>
      <div className='flex flex-1 flex-wrap items-center gap-2'>
        <Input
          placeholder='Search for tariff parameter...'
          value={search || ''}
          onChange={handleSearchChange}
          className='h-9 w-56 lg:w-72'
        />

        {hasActiveFilters && (
          <Button
            variant='outline'
            size='sm'
            className='h-9 border-dashed'
            onClick={handleResetFilters}
          >
            <Cross2Icon />
            Clean Search
          </Button>
        )}
      </div>
    </div>
  );
}
