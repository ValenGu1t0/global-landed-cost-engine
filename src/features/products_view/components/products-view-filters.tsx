'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useQueryState } from 'nuqs';
import { DataTableFacetedFilter } from '@/components/ui/table/data-table-faceted-filter';
import { useTransitionContext } from '@/hooks/use-transition-context';
import { useDebouncedQueryState } from '@/hooks/use-debounced-query-state';
import { useQuery } from '@tanstack/react-query';
import { FilterSelect } from '@/components/ui/filter-select';
import { productsViewSearchParams } from '@/features/products_view/searchparams';
import { getVendors } from '../data/categories/get-vendors';
import { getBrands } from '../data/categories/get-brands';
import { getCategories } from '../data/categories/get-categories';
import { getConsumerUses } from '../data/categories/get-consumer-uses';
import { getProductCollections } from '../data/categories/get-product-collections';
import { getRawMaterials } from '../data/categories/get-raw-materials';
import { getSeasons } from '../data/categories/get-seasons';
import { getSetCollections } from '../data/categories/get-set-collections';
import { getStatuses } from '../data/categories/get-statuses';
import { STOCK_OPTIONS, TYPE_OPTIONS } from '@/constants/data';

export function ProductsViewFilters() {
  const { startTransition } = useTransitionContext();

  const [name, setName] = useDebouncedQueryState(
    'name',
    productsViewSearchParams.name,
    {
      startTransition,
      shallow: false,
      debounceMs: 500
    }
  );

  const [category, setCategory] = useQueryState(
    'category',
    productsViewSearchParams.category.withOptions({
      startTransition,
      shallow: false
    })
  );

  const [stock, setStock] = useQueryState(
    'stock',
    productsViewSearchParams.stock.withOptions({
      startTransition,
      shallow: false
    })
  );

  const [type, setType] = useQueryState(
    'type',
    productsViewSearchParams.type.withOptions({
      startTransition,
      shallow: false
    })
  );

  const [vendor, setVendor] = useQueryState(
    'vendor',
    productsViewSearchParams.vendor.withOptions({
      startTransition,
      shallow: false
    })
  );

  const [brand, setBrand] = useQueryState(
    'brand_name',
    productsViewSearchParams.brand_name.withOptions({
      startTransition,
      shallow: false
    })
  );

  const [consumerUse, setConsumerUse] = useQueryState(
    'consumer_use',
    productsViewSearchParams.consumer_use.withOptions({
      startTransition,
      shallow: false
    })
  );

  const [productCollection, setProductCollection] = useQueryState(
    'product_collection',
    productsViewSearchParams.product_collection.withOptions({
      startTransition,
      shallow: false
    })
  );

  const [rawMaterial, setRawMaterial] = useQueryState(
    'raw_material',
    productsViewSearchParams.raw_material.withOptions({
      startTransition,
      shallow: false
    })
  );

  const [season, setSeason] = useQueryState(
    'season',
    productsViewSearchParams.season.withOptions({
      startTransition,
      shallow: false
    })
  );

  const [setCollection, setSetCollection] = useQueryState(
    'set_collection',
    productsViewSearchParams.set_collection.withOptions({
      startTransition,
      shallow: false
    })
  );

  const [status, setStatus] = useQueryState(
    'status',
    productsViewSearchParams.status.withOptions({
      startTransition,
      shallow: false
    })
  );

  const [page, setPage] = useQueryState(
    'page',
    productsViewSearchParams.page.withOptions({
      startTransition,
      shallow: false
    })
  );

  const { data: vendors = [] } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => getVendors()
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['brand_name'],
    queryFn: () => getBrands()
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories()
  });

  const { data: consumerUses = [] } = useQuery({
    queryKey: ['consumerUses'],
    queryFn: () => getConsumerUses()
  });

  const { data: productCollections = [] } = useQuery({
    queryKey: ['productCollections'],
    queryFn: () => getProductCollections()
  });

  const { data: rawMaterials = [] } = useQuery({
    queryKey: ['rawMaterials'],
    queryFn: () => getRawMaterials()
  });

  const { data: seasons = [] } = useQuery({
    queryKey: ['seasons'],
    queryFn: () => getSeasons()
  });

  const { data: setCollections = [] } = useQuery({
    queryKey: ['setCollections'],
    queryFn: () => getSetCollections()
  });

  const { data: statuses = [] } = useQuery({
    queryKey: ['statuses'],
    queryFn: () => getStatuses()
  });

  const vendorOptions = React.useMemo(() => {
    return vendors.map((v) => ({
      value: v.id,
      label: v.label
    }));
  }, [vendors]);

  const brandOptions = React.useMemo(() => {
    return brands.map((b) => ({
      value: b.id,
      label: b.label
    }));
  }, [brands]);

  const categoryOptions = React.useMemo(() => {
    return categories.map((c) => ({
      value: c.id,
      label: c.label
    }));
  }, [categories]);

  const consumerUseOptions = React.useMemo(() => {
    return consumerUses.map((cu) => ({
      value: cu.id,
      label: cu.label
    }));
  }, [consumerUses]);

  const productCollectionOptions = React.useMemo(() => {
    return productCollections.map((pc) => ({
      value: pc.id,
      label: pc.label
    }));
  }, [productCollections]);

  const rawMaterialOptions = React.useMemo(() => {
    return rawMaterials.map((rm) => ({
      value: rm.id,
      label: rm.label
    }));
  }, [rawMaterials]);

  const seasonOptions = React.useMemo(() => {
    return seasons.map((s) => ({
      value: s.id,
      label: s.label
    }));
  }, [seasons]);

  const setCollectionOptions = React.useMemo(() => {
    return setCollections.map((sc) => ({
      value: sc.id,
      label: sc.label
    }));
  }, [setCollections]);

  const statusOptions = React.useMemo(() => {
    const base = statuses.map((s) => ({
      value: s.id,
      label: s.label
    }));

    return [
      ...base,
      {
        value: 'DISCONTINUED IN WH',
        label: 'DISCONTINUED IN WH'
      }
    ];
  }, [statuses]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setName(e.target?.value || null);
    if (page !== 1) setPage(1);
  };

  /* const handleCategoryChange = (values: string[] | undefined): void => {
    const categoryString =
      values && values.length > 0 ? values.join(',') : null;
    setCategory(categoryString);
    if (page !== 1) setPage(1);
  }; */

  const handleStockChange = (value: string | null): void => {
    setStock(value);
    if (page !== 1) setPage(1);
  };

  const handleTypeChange = (value: string | null): void => {
    setType(value);
    if (page !== 1) setPage(1);
  };

  const handleVendorChange = React.useCallback(
    (values: string[] | undefined) => {
      const vendorString =
        values && values.length > 0 ? values.join(',') : null;
      setVendor(vendorString);
      if (page !== 1) setPage(1);
    },
    [setVendor, page, setPage]
  );

  const handleBrandChange = React.useCallback(
    (values: string[] | undefined) => {
      const brandString = values && values.length > 0 ? values.join(',') : null;
      setBrand(brandString);
      if (page !== 1) setPage(1);
    },
    [setBrand, page, setPage]
  );

  const handleCategoryChange = React.useCallback(
    (values: string[] | undefined) => {
      const categoryString =
        values && values.length > 0 ? values.join(',') : null;
      setCategory(categoryString);
      if (page !== 1) setPage(1);
    },
    [setCategory, page, setPage]
  );

  const handleConsumerUseChange = React.useCallback(
    (values: string[] | undefined) => {
      const consumerUseString =
        values && values.length > 0 ? values.join(',') : null;
      setConsumerUse(consumerUseString);
      if (page !== 1) setPage(1);
    },
    [setConsumerUse, page, setPage]
  );

  const handleProductCollectionChange = React.useCallback(
    (values: string[] | undefined) => {
      const productCollectionString =
        values && values.length > 0 ? values.join(',') : null;
      setProductCollection(productCollectionString);
      if (page !== 1) setPage(1);
    },
    [setProductCollection, page, setPage]
  );

  const handleRawMaterialChange = React.useCallback(
    (values: string[] | undefined) => {
      const rawMaterialString =
        values && values.length > 0 ? values.join(',') : null;
      setRawMaterial(rawMaterialString);
      if (page !== 1) setPage(1);
    },
    [setRawMaterial, page, setPage]
  );

  const handleSeasonChange = React.useCallback(
    (values: string[] | undefined) => {
      const seasonString =
        values && values.length > 0 ? values.join(',') : null;
      setSeason(seasonString);
      if (page !== 1) setPage(1);
    },
    [setSeason, page, setPage]
  );

  const handleSetCollectionChange = React.useCallback(
    (values: string[] | undefined) => {
      const setCollectionString =
        values && values.length > 0 ? values.join(',') : null;
      setSetCollection(setCollectionString);
      if (page !== 1) setPage(1);
    },
    [setSetCollection, page, setPage]
  );

  const handleStatusChange = React.useCallback(
    (values: string[] | undefined) => {
      const statusString =
        values && values.length > 0 ? values.join(',') : null;
      setStatus(statusString);
      if (page !== 1) setPage(1);
    },
    [setStatus, page, setPage]
  );

  const vendorValues = React.useMemo(() => {
    return vendor ? vendor.split(',') : [];
  }, [vendor]);

  const brandValues = React.useMemo(() => {
    return brand ? brand.split(',') : [];
  }, [brand]);

  const categoryValues = React.useMemo(() => {
    return category ? category.split(',') : [];
  }, [category]);

  const consumerUseValues = React.useMemo(() => {
    return consumerUse ? consumerUse.split(',') : [];
  }, [consumerUse]);

  const productCollectionValues = React.useMemo(() => {
    return productCollection ? productCollection.split(',') : [];
  }, [productCollection]);

  const rawMaterialValues = React.useMemo(() => {
    return rawMaterial ? rawMaterial.split(',') : [];
  }, [rawMaterial]);

  const seasonValues = React.useMemo(() => {
    return season ? season.split(',') : [];
  }, [season]);

  const setCollectionValues = React.useMemo(() => {
    return setCollection ? setCollection.split(',') : [];
  }, [setCollection]);

  const statusValues = React.useMemo(() => {
    return status ? status.split(',') : [];
  }, [status]);

  const vendorColumn = React.useMemo(() => {
    return {
      getFilterValue: () => vendorValues,
      setFilterValue: handleVendorChange,
      getFacetedUniqueValues: () => new Map()
    };
  }, [vendorValues, handleVendorChange]);

  const brandColumn = React.useMemo(() => {
    return {
      getFilterValue: () => brandValues,
      setFilterValue: handleBrandChange,
      getFacetedUniqueValues: () => new Map()
    };
  }, [brandValues, handleBrandChange]);

  const categoryColumn = React.useMemo(() => {
    return {
      getFilterValue: () => categoryValues,
      setFilterValue: handleCategoryChange,
      getFacetedUniqueValues: () => new Map()
    };
  }, [categoryValues, handleCategoryChange]);

  const consumerUseColumn = React.useMemo(() => {
    return {
      getFilterValue: () => consumerUseValues,
      setFilterValue: handleConsumerUseChange,
      getFacetedUniqueValues: () => new Map()
    };
  }, [consumerUseValues, handleConsumerUseChange]);

  const productCollectionColumn = React.useMemo(() => {
    return {
      getFilterValue: () => productCollectionValues,
      setFilterValue: handleProductCollectionChange,
      getFacetedUniqueValues: () => new Map()
    };
  }, [productCollectionValues, handleProductCollectionChange]);

  const rawMaterialColumn = React.useMemo(() => {
    return {
      getFilterValue: () => rawMaterialValues,
      setFilterValue: handleRawMaterialChange,
      getFacetedUniqueValues: () => new Map()
    };
  }, [rawMaterialValues, handleRawMaterialChange]);

  const seasonColumn = React.useMemo(() => {
    return {
      getFilterValue: () => seasonValues,
      setFilterValue: handleSeasonChange,
      getFacetedUniqueValues: () => new Map()
    };
  }, [seasonValues, handleSeasonChange]);

  const setCollectionColumn = React.useMemo(() => {
    return {
      getFilterValue: () => setCollectionValues,
      setFilterValue: handleSetCollectionChange,
      getFacetedUniqueValues: () => new Map()
    };
  }, [setCollectionValues, handleSetCollectionChange]);

  const statusColumn = React.useMemo(() => {
    return {
      getFilterValue: () => statusValues,
      setFilterValue: handleStatusChange,
      getFacetedUniqueValues: () => new Map()
    };
  }, [statusValues, handleStatusChange]);

  const handleResetFilters = (): void => {
    setStock(null);
    setType(null);
    setVendor(null);
    setBrand(null);
    setPage(1);
    setName(null);
    setCategory(null);
    setConsumerUse(null);
    setProductCollection(null);
    setRawMaterial(null);
    setSeason(null);
    setSetCollection(null);
    setStatus(null);
  };

  /* const categoryValues = category ? category.split(',') : []; */

  /* const categoryColumn = {
    getFilterValue: () => categoryValues,
    setFilterValue: handleCategoryChange,
    getFacetedUniqueValues: () => new Map()
  }; */

  const hasActiveFilters =
    name !== null ||
    category !== null ||
    stock !== null ||
    vendor !== null ||
    brand !== null ||
    consumerUse !== null ||
    productCollection !== null ||
    rawMaterial !== null ||
    season !== null ||
    setCollection !== null ||
    status !== null;

  return (
    <div className='flex w-full items-center gap-2'>
      <div className='flex flex-1 flex-wrap items-center gap-2'>
        <Input
          placeholder='Search products...'
          value={name || ''}
          onChange={handleNameChange}
          className='h-9 w-40 lg:w-56'
        />

        {/* <DataTableFacetedFilter
          column={categoryColumn as any}
          title='Categoría'
          options={CATEGORIES}
          multiple={true}
        /> */}

        <FilterSelect
          value={stock}
          onValueChange={handleStockChange}
          options={STOCK_OPTIONS}
          placeholder='Stock'
          isLoading={false}
          className='h-9 w-40 lg:w-25'
        />

        <FilterSelect
          value={type}
          onValueChange={handleTypeChange}
          options={TYPE_OPTIONS}
          placeholder='Product Type'
          isLoading={false}
          className='h-9 w-40 lg:w-35'
        />

        <DataTableFacetedFilter
          column={statusColumn as any}
          title='Status'
          options={statusOptions}
          multiple={true}
        />

        <DataTableFacetedFilter
          column={vendorColumn as any}
          title='Vendor'
          options={vendorOptions}
          multiple={true}
        />

        <DataTableFacetedFilter
          column={brandColumn as any}
          title='Brand'
          options={brandOptions}
          multiple={true}
        />

        <DataTableFacetedFilter
          column={categoryColumn as any}
          title='Category'
          options={categoryOptions}
          multiple={true}
        />

        <DataTableFacetedFilter
          column={consumerUseColumn as any}
          title='Consumer Use'
          options={consumerUseOptions}
          multiple={true}
        />

        <DataTableFacetedFilter
          column={productCollectionColumn as any}
          title='Product Collection'
          options={productCollectionOptions}
          multiple={true}
        />

        <DataTableFacetedFilter
          column={rawMaterialColumn as any}
          title='Raw Material'
          options={rawMaterialOptions}
          multiple={true}
        />

        <DataTableFacetedFilter
          column={seasonColumn as any}
          title='Season'
          options={seasonOptions}
          multiple={true}
        />

        <DataTableFacetedFilter
          column={setCollectionColumn as any}
          title='Set Collection'
          options={setCollectionOptions}
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
