'use server';

import { authActionClient } from '@/lib/actions/safe-action';
import { addProductSchema } from './add-product-schema';
import db from '@/db';
import {
  productTable,
  productHistoricCostsTable,
  productViewTable
} from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { COST_MAP } from '@/constants/data';
import { getVendorPrefix } from '../data/get-vendor-prefix';
import { calculateProductEconomics } from '@/lib/calculator/landed-cost-engine';
import { checkAndConsumeDemoQuota } from '@/lib/demo-guardrails';

export const addProduct = authActionClient
  .metadata({ actionName: 'createProduct' })
  .inputSchema(addProductSchema)
  .action(async ({ parsedInput, ctx }) => {
    // Check daily portfolio quota
    const quotaCheck = await checkAndConsumeDemoQuota(
      ctx?.session?.user?.id,
      1,
      'product_create'
    );
    if (!quotaCheck.allowed) {
      throw new Error(
        quotaCheck.message ||
          'Daily demo quota exceeded: A maximum of 10 products can be created per day in this demo.'
      );
    }

    // EXTRAEMOS commentaries para que NO vayan al productTable
    const {
      fob_commentary,
      exw_commentary,
      cnf_commentary,
      ddp_commentary,
      cnf_diff_commentary,
      ...productDataInput
    } = parsedInput;

    // Validar hemicode repetido
    if (parsedInput.hemicode) {
      const repeatedProduct = await db
        .select()
        .from(productTable)
        .where(eq(productTable.hemicode, parsedInput.hemicode))
        .limit(1);

      if (repeatedProduct.length > 0) {
        throw new Error(
          `Product with this hemicode already exists: ${parsedInput.hemicode}`
        );
      }
    }

    // Insert del producto
    const [newProduct] = await db
      .insert(productTable)
      .values(productDataInput)
      .returning({
        id: productTable.tech_sku_id,
        hemicode: productTable.hemicode,
        status: productTable.status,
        vendor: productTable.vendor
      });

    const techSkuId = newProduct.id;
    let finalHemicode = newProduct.hemicode;

    //If the product is a project without hemicode, assign one by default
    if (newProduct.status === 'PROJECT' && !finalHemicode) {
      finalHemicode = `PROJ-${techSkuId}`;
      await db
        .update(productTable)
        .set({ hemicode: finalHemicode })
        .where(eq(productTable.tech_sku_id, techSkuId));
    }

    if (newProduct.status === 'GS' && !finalHemicode) {
      let vendorPrefix = await getVendorPrefix(newProduct.vendor);

      if (!vendorPrefix) {
        vendorPrefix = 'AUX';
      }

      finalHemicode = `GS-${vendorPrefix}-${techSkuId}`;

      await db
        .update(productTable)
        .set({ hemicode: finalHemicode })
        .where(eq(productTable.tech_sku_id, techSkuId));
    }

    const now = new Date();
    const endOfTimes = new Date('2100-01-01T00:00:00.000Z');

    const commentaryMap = {
      fob_commentary,
      exw_commentary,
      cnf_commentary,
      ddp_commentary,
      cnf_diff_commentary
    };

    const historicCostValues = [];

    for (const field of Object.keys(COST_MAP) as Array<keyof typeof COST_MAP>) {
      const costValue = parsedInput[field];

      if (costValue != null) {
        const { incoterm, commentary } = COST_MAP[field];

        historicCostValues.push({
          tech_sku_id: techSkuId,
          start_date: now,
          end_date: endOfTimes,
          cost: costValue,
          cost_update_commentary: commentaryMap[commentary] ?? 'No commentary',
          import_incoterm: incoterm
        });
      }
    }

    if (historicCostValues.length > 0) {
      await db.insert(productHistoricCostsTable).values(historicCostValues);
    }

    // Compute deterministic container economics & Landed Costs
    const economics = calculateProductEconomics({
      ...productDataInput,
      tech_sku_id: techSkuId,
      hemicode: finalHemicode,
      status: newProduct.status,
      vendor: newProduct.vendor,
      fob_current_cost_value: parsedInput.fob,
      exw_current_cost_value: parsedInput.exw,
      cnf_current_cost_value: parsedInput.cnf,
      ddp_current_cost_value: parsedInput.ddp,
      mrsp: parsedInput.mrsp,
      commission_percentage: parsedInput.commission_percentage
    });

    await db.insert(productViewTable).values({
      tech_sku_id: techSkuId,
      hemicode: finalHemicode,
      status: newProduct.status,
      vendor: newProduct.vendor,
      brand_name: productDataInput.brand_name,
      origin_country: productDataInput.origin_country,
      factory_name: productDataInput.factory_name,
      description: productDataInput.description,
      short_description: productDataInput.short_description,
      super_category: productDataInput.super_category,
      category: productDataInput.category,
      sub_category: productDataInput.sub_category,
      consumer_use: productDataInput.consumer_use,
      season: productDataInput.season,
      color_family: productDataInput.color_family,
      raw_material: productDataInput.raw_material,
      packing: productDataInput.packing,
      pieces_per_unit: productDataInput.pieces_per_unit,
      case_pack: productDataInput.case_pack,
      carton_length_mm: productDataInput.carton_length_mm,
      carton_height_mm: productDataInput.carton_height_mm,
      carton_width_mm: productDataInput.carton_width_mm,
      carton_weight_kg: productDataInput.carton_weight_kg,
      fob_current_cost_value: parsedInput.fob,
      exw_current_cost_value: parsedInput.exw,
      cnf_current_cost_value: parsedInput.cnf,
      ddp_current_cost_value: parsedInput.ddp,
      mrsp: parsedInput.mrsp,
      commission_percentage: parsedInput.commission_percentage,
      ...economics
    });

    revalidatePath('/dashboard/products_view');
    revalidatePath(`/dashboard/products_view/${techSkuId}`);

    return {
      message: 'Product created successfully',
      newProductId: newProduct.id,
      newProductHemicode: newProduct.hemicode,
      historicCostsInserted: historicCostValues.length
    };
  });
