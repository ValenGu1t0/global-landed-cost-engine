'use server';

import db from '@/db';
import { productViewTable } from '@/db/schema';
import {
  getProductsViewSchema,
  GetProductsViewSchema
} from './get-products-view-schema';
import { ProductsViewTable } from '@/db/schema';
import { ValidationError } from '@/lib/errors';
import {
  eq,
  like,
  and,
  or,
  asc,
  desc,
  SQL,
  count,
  inArray,
  gt
} from 'drizzle-orm';

export async function getProductsView(input: GetProductsViewSchema): Promise<{
  products: ProductsViewTable[];
  totalCount: number;
}> {
  // Data is queried directly from product_view_table
  const result = getProductsViewSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error));
  }

  const parsedInput = result.data;
  const page = parsedInput.page || 1;
  const limit = parsedInput.limit || 10;
  const offset = (page - 1) * limit;

  const conditions = [];

  // Stock > 0
  if (parsedInput.stock === true || parsedInput.stock === 'true') {
    conditions.push(gt(productViewTable.inventory_today, 0));
  }

  // Product or kit
  if (parsedInput.type) {
    conditions.push(eq(productViewTable.product_or_kit, parsedInput.type));
  }

  // Vendor
  if (parsedInput.vendor) {
    const vendors = parsedInput.vendor.split(',').filter(Boolean);
    if (vendors.length > 0) {
      conditions.push(
        or(...vendors.map((v) => eq(productViewTable.vendor, v.trim())))
      );
    }
  }

  // Brand
  if (parsedInput.brand_name) {
    const brands = parsedInput.brand_name.split(',').filter(Boolean);
    if (brands.length > 0) {
      conditions.push(
        or(...brands.map((v) => eq(productViewTable.brand_name, v.trim())))
      );
    }
  }

  // Category
  if (parsedInput.category) {
    const categories = parsedInput.category.split(',').filter(Boolean);
    if (categories.length > 0) {
      conditions.push(
        or(...categories.map((v) => eq(productViewTable.category, v.trim())))
      );
    }
  }

  // Consumer use
  if (parsedInput.consumer_use) {
    const consumer_uses = parsedInput.consumer_use.split(',').filter(Boolean);
    if (consumer_uses.length > 0) {
      conditions.push(
        or(
          ...consumer_uses.map((v) =>
            eq(productViewTable.consumer_use, v.trim())
          )
        )
      );
    }
  }

  // Product Collection
  if (parsedInput.product_collection) {
    const product_collections = parsedInput.product_collection
      .split(',')
      .filter(Boolean);
    if (product_collections.length > 0) {
      conditions.push(
        or(
          ...product_collections.map((v) =>
            eq(productViewTable.product_collection, v.trim())
          )
        )
      );
    }
  }

  // Raw Material
  if (parsedInput.raw_material) {
    const raw_materials = parsedInput.raw_material.split(',').filter(Boolean);
    if (raw_materials.length > 0) {
      conditions.push(
        or(
          ...raw_materials.map((v) =>
            eq(productViewTable.raw_material, v.trim())
          )
        )
      );
    }
  }

  // Season
  if (parsedInput.season) {
    const seasons = parsedInput.season.split(',').filter(Boolean);
    if (seasons.length > 0) {
      conditions.push(
        or(...seasons.map((v) => eq(productViewTable.season, v.trim())))
      );
    }
  }

  // Set collection
  if (parsedInput.set_collection) {
    const set_collections = parsedInput.set_collection
      .split(',')
      .filter(Boolean);
    if (set_collections.length > 0) {
      conditions.push(
        or(
          ...set_collections.map((v) =>
            eq(productViewTable.set_collection, v.trim())
          )
        )
      );
    }
  }

  // Status
  if (parsedInput.status) {
    const statuses = parsedInput.status.split(',').filter(Boolean);
    const statusConditions: SQL[] = [];
    const hasDiscontinued = statuses.includes('DISCONTINUED IN WH');
    const realStatuses = statuses.filter((s) => s !== 'DISCONTINUED IN WH');

    // Status reales (ACTIVE, INACTIVE, GS, PROJECT)
    if (realStatuses.length > 0) {
      const realStatusWhere = or(
        ...realStatuses.map((s) => eq(productViewTable.status, s))
      );

      if (realStatusWhere) {
        statusConditions.push(realStatusWhere);
      }
    }

    // DISCONTINUED..
    if (hasDiscontinued) {
      const discontinuedWhere = and(
        eq(productViewTable.status, 'INACTIVE'),
        gt(productViewTable.inventory_today, 0)
      );

      if (discontinuedWhere) {
        statusConditions.push(discontinuedWhere);
      }
    }

    const statusWhere = or(...statusConditions);

    if (statusWhere) {
      conditions.push(statusWhere);
    }
  }

  // Search
  if (parsedInput.search) {
    conditions.push(
      or(
        like(productViewTable.hts_code, `\%${parsedInput.search}\%`),
        like(productViewTable.cn_code, `\%${parsedInput.search}\%`),

        like(productViewTable.vendor, `\%${parsedInput.search}\%`),
        like(productViewTable.brand_name, `\%${parsedInput.search}\%`),
        like(productViewTable.category, `\%${parsedInput.search}\%`),

        like(productViewTable.factory_mold, `\%${parsedInput.search}\%`),
        like(productViewTable.factory_name, `\%${parsedInput.search}\%`),
        like(productViewTable.factory_code, `\%${parsedInput.search}\%`)
      )
    );
  }

  // IDs seleccionados (excel selección)
  if (parsedInput.ids && parsedInput.ids.length > 0) {
    conditions.push(inArray(productViewTable.tech_sku_id, parsedInput.ids));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Order By: solo campos válidos
  const orderByMap: Record<string, any> = {
    id: productViewTable.tech_sku_id,
    name: productViewTable.hts_code,
    description: productViewTable.description,
    vendor: productViewTable.vendor,
    brand_name: productViewTable.brand_name,
    stock: productViewTable.inventory_today
  };

  const orderByClause: SQL[] = [];
  if (parsedInput.sortBy && orderByMap[parsedInput.sortBy]) {
    const col = orderByMap[parsedInput.sortBy];
    orderByClause.push(
      parsedInput.sortDirection === 'desc' ? desc(col) : asc(col)
    );
  }

  // ✔ FIX: SIEMPRE seleccionar todas las columnas
  const filteredProducts = await db
    .select()
    .from(productViewTable)
    .where(whereClause)
    .orderBy(
      ...(orderByClause.length > 0
        ? orderByClause
        : [asc(productViewTable.tech_sku_id)])
    )
    .limit(limit)
    .offset(offset);

  // Count total
  const [{ count: totalCount }] = await db
    .select({ count: count() })
    .from(productViewTable)
    .where(whereClause);

  return {
    products: filteredProducts as ProductsViewTable[],
    totalCount
  };
}
