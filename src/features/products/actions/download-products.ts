'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { downloadProductsSchema } from './download-products-schema';
import { getProducts } from '../data/get-products';
import { Product } from '@/db/schema';
import { createExcelBase64, ExcelColumnConfig } from '@/lib/excel';
import { EXCEL_DEFAULT_MIME_TYPE } from '@/mime_types';

const COLUMN_CONFIGS: Record<string, ExcelColumnConfig<Product>> = {
  name: {
    id: 'name',
    header: 'Nombre',
    format: (_, row) => row.name
  },
  category: {
    id: 'category',
    header: 'Categoría',
    format: (_, row) => row.category
  },
  price: {
    id: 'price',
    header: 'Precio',
    format: (_, row) =>
      typeof row.price === 'number' ? `$${row.price.toFixed(2)}` : ''
  },
  description: {
    id: 'description',
    header: 'Descripción',
    format: (_, row) => row.description || ''
  },
  photo_url: {
    id: 'photo_url',
    header: 'Foto',
    image: {
      getUrl: (row) => row.photo_url,
      width: 100,
      height: 100
    }
  },
  created_at: {
    id: 'created_at',
    header: 'Fecha de Creación',
    format: (_, row) =>
      row.created_at ? new Date(row.created_at).toLocaleDateString('es-AR') : ''
  },
  updated_at: {
    id: 'updated_at',
    header: 'Última Actualización',
    format: (_, row) =>
      row.updated_at ? new Date(row.updated_at).toLocaleDateString('es-AR') : ''
  }
};

export const downloadProducts = authActionClient
  .metadata({ actionName: 'downloadProducts' })
  .inputSchema(downloadProductsSchema)
  .action(async ({ parsedInput }) => {
    const { columns, ids, search, category, sortBy, sortDirection } =
      parsedInput;

    const { products } = await getProducts({
      page: 1,
      limit: 10000,
      search,
      category,
      sortBy,
      sortDirection,
      ids,
      columns
    });

    const columnConfigs = columns?.map((col) => COLUMN_CONFIGS[col]) ?? [];

    const base64 = await createExcelBase64({
      sheetName: 'Products',
      columns: columnConfigs,
      data: products
    });

    return {
      base64,
      filename: 'products.xlsx',
      mimeType: EXCEL_DEFAULT_MIME_TYPE
    };
  });
