'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useQueryState } from 'nuqs';
import { useTransitionContext } from '@/hooks/use-transition-context';
import { useDebouncedQueryState } from '@/hooks/use-debounced-query-state';
import { useQuery } from '@tanstack/react-query';
import { getStatuses } from '@/features/products_view/data/categories/get-statuses';
import { deactivateStatusSearchParams } from '../searchparams';
import { DataTableFacetedFilter } from '@/components/ui/table/data-table-faceted-filter';

export function DeactivateStatusFilters() {
  const { startTransition } = useTransitionContext();

  const [hemicode, setHemicode] = useDebouncedQueryState(
    'hemicode',
    deactivateStatusSearchParams.hemicode,
    {
      startTransition,
      shallow: false,
      debounceMs: 500
    }
  );

  const [status, setStatus] = useQueryState(
    'status',
    deactivateStatusSearchParams.status.withOptions({
      startTransition,
      shallow: false
    })
  );

  const [page, setPage] = useQueryState(
    'page',
    deactivateStatusSearchParams.page.withOptions({
      startTransition,
      shallow: false
    })
  );

  const { data: statuses = [] } = useQuery({
    queryKey: ['statuses'],
    queryFn: () => getStatuses()
  });

  const statusOptions = React.useMemo(() => {
    return statuses
      .filter((s) => s.label !== 'INACTIVE')
      .map((s) => ({
        value: s.id,
        label: s.label
      }));
  }, [statuses]);

  const handleHemicodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setHemicode(e.target?.value || null);
    if (page !== 1) setPage(1);
  };

  const handleStatusChange = React.useCallback(
    (values: string[] | null) => {
      const statusString =
        values && values.length > 0 ? values.join(',') : null;
      setStatus(statusString);
      if (page !== 1) setPage(1);
    },
    [setStatus, page, setPage]
  );

  const statusValues = React.useMemo(() => {
    return status ? status.split(',') : [];
  }, [status]);

  const statusColumn = React.useMemo(() => {
    return {
      getFilterValue: () => statusValues,
      setFilterValue: handleStatusChange,
      getFacetedUniqueValues: () => new Map()
    };
  }, [statusValues, handleStatusChange]);

  const handleResetFilters = (): void => {
    setPage(1);
    setHemicode(null);
    setStatus(null);
  };

  const hasActiveFilters = hemicode !== null || status !== null;

  return (
    <div className='flex w-full items-center gap-2'>
      <div className='flex flex-1 flex-wrap items-center gap-2'>
        <Input
          placeholder='Search hemicodes...'
          value={hemicode || ''}
          onChange={handleHemicodeChange}
          className='h-9 w-40 lg:w-56'
        />

        <DataTableFacetedFilter
          column={statusColumn as any}
          title='Status'
          options={statusOptions}
          multiple={true}
        />

        {hasActiveFilters && (
          <Button
            variant='outline'
            size='sm'
            className='h-9 border-dashed'
            onClick={handleResetFilters}
          >
            <Cross2Icon className='mr-2 h-4 w-4' />
            Clean Filters
          </Button>
        )}
      </div>
    </div>
  );
}
