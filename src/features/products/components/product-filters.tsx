'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useQueryState } from 'nuqs';
import { DataTableFacetedFilter } from '@/components/ui/table/data-table-faceted-filter';
import { CATEGORIES } from '@/features/products/data/constants';
import { productSearchParams } from '@/features/products/searchparams';
import { useTransitionContext } from '@/hooks/use-transition-context';
import { useDebouncedQueryState } from '@/hooks/use-debounced-query-state';
import { useQuery } from '@tanstack/react-query';
import { getAreas } from '@/features/products/data/get-areas';
import { getSubAreas } from '@/features/products/data/get-sub-areas';
import { FilterSelect } from '@/components/ui/filter-select';

export function ProductFilters() {
  const { startTransition } = useTransitionContext();

  const [name, setName] = useDebouncedQueryState(
    'name',
    productSearchParams.name,
    {
      startTransition,
      shallow: false,
      debounceMs: 500
    }
  );

  const [category, setCategory] = useQueryState(
    'category',
    productSearchParams.category.withOptions({
      startTransition,
      shallow: false
    })
  );

  const [area, setArea] = useQueryState(
    'area',
    productSearchParams.area.withOptions({
      startTransition,
      shallow: false
    })
  );

  const [subArea, setSubArea] = useQueryState(
    'subArea',
    productSearchParams.subArea.withOptions({
      startTransition,
      shallow: false
    })
  );

  const [page, setPage] = useQueryState(
    'page',
    productSearchParams.page.withOptions({
      startTransition,
      shallow: false
    })
  );

  const { data: areas = [], isLoading: isLoadingAreas } = useQuery({
    queryKey: ['areas'],
    queryFn: () => getAreas({})
  });

  const { data: subAreas = [], isLoading: isLoadingSubAreas } = useQuery({
    queryKey: ['sub-areas', area],
    queryFn: () => getSubAreas({ areaId: area! }),
    enabled: !!area
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setName(e.target?.value || null);
    if (page !== 1) {
      setPage(1);
    }
  };

  const handleCategoryChange = (values: string[] | undefined): void => {
    const categoryString =
      values && values.length > 0 ? values.join(',') : null;
    setCategory(categoryString);
    if (page !== 1) {
      setPage(1);
    }
  };

  const handleAreaChange = (value: string | null): void => {
    setArea(value);
    setSubArea(null);
    if (page !== 1) {
      setPage(1);
    }
  };

  const handleSubAreaChange = (value: string | null): void => {
    setSubArea(value);
    if (page !== 1) {
      setPage(1);
    }
  };

  const handleResetFilters = (): void => {
    setName(null);
    setCategory(null);
    setArea(null);
    setSubArea(null);
    setPage(1);
  };

  const categoryValues = category ? category.split(',') : [];

  const categoryColumn = {
    getFilterValue: () => categoryValues,
    setFilterValue: handleCategoryChange,
    getFacetedUniqueValues: () => new Map()
  };

  const hasActiveFilters =
    name !== null || category !== null || area !== null || subArea !== null;

  return (
    <div className='flex w-full items-center gap-2'>
      <div className='flex flex-1 flex-wrap items-center gap-2'>
        <Input
          placeholder='Search products...'
          value={name || ''}
          onChange={handleNameChange}
          className='h-9 w-40 lg:w-56'
        />

        <DataTableFacetedFilter
          column={categoryColumn as any}
          title='Categoría'
          options={CATEGORIES}
          multiple={true}
        />

        <FilterSelect
          value={area}
          onValueChange={handleAreaChange}
          options={areas}
          placeholder='Área'
          isLoading={isLoadingAreas}
          className='h-9 w-40 lg:w-48'
        />

        <FilterSelect
          value={subArea}
          onValueChange={handleSubAreaChange}
          options={subAreas}
          placeholder='Sub-área'
          isLoading={isLoadingSubAreas}
          disabled={!area}
          className='h-9 w-40 lg:w-48'
        />

        {hasActiveFilters && (
          <Button
            variant='outline'
            size='sm'
            className='h-9 border-dashed'
            onClick={handleResetFilters}
          >
            <Cross2Icon />
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
}
