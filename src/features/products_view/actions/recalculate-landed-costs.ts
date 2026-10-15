'use server';

import db from '@/db';
import { productTable, productViewTable } from '@/db/schema';
import { calculateProductEconomics } from '@/lib/calculator/landed-cost-engine';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export interface RecalculateResult {
  success: boolean;
  message: string;
  processedCount: number;
  durationMs: number;
  logs: string[];
}

export async function recalculateLandedCostsAction(): Promise<RecalculateResult> {
  const startTime = Date.now();
  const logs: string[] = [];

  try {
    logs.push('[1/5] 📦 Reading product catalog from database...');
    const products = await db.select().from(productTable);

    if (products.length === 0) {
      // Check product_view_table as well
      const viewProducts = await db.select().from(productViewTable);
      if (viewProducts.length === 0) {
        return {
          success: true,
          message:
            'No products found to calculate. Use the Seed button to generate sample products.',
          processedCount: 0,
          durationMs: Date.now() - startTime,
          logs: [
            ...logs,
            '⚠️ Database currently contains 0 products.',
            'Tip: Run seed data to populate realistic demo products.'
          ]
        };
      }

      logs.push(
        `[2/5] 📐 Found ${viewProducts.length} items in product_view_table. Optimizing container capacities...`
      );
      for (const p of viewProducts) {
        const econ = calculateProductEconomics(p);
        await db
          .update(productViewTable)
          .set({
            case_cbm: econ.case_cbm,
            case_cft: econ.case_cft,
            carton_length_in: econ.carton_length_in,
            carton_height_in: econ.carton_height_in,
            carton_width_in: econ.carton_width_in,
            carton_weight_lb: econ.carton_weight_lb,
            pieces_per_carton: econ.pieces_per_carton,
            duty_cost: econ.duty_cost,
            tariff: econ.tariff,

            // 40HC
            calculated_cartons_40hc_per_volume:
              econ.calculated_cartons_40hc_per_volume,
            calculated_case_pack_40hc_per_volume:
              econ.calculated_case_pack_40hc_per_volume,
            optimal_cartons_per_40hc: econ.optimal_cartons_per_40hc,
            optimal_pieces_per_40hc: econ.optimal_pieces_per_40hc,
            logistic_cost_40hc: econ.logistic_cost_40hc,
            landed_cost_40hc: econ.landed_cost_40hc,

            // 45HC
            calculated_cartons_45hc_per_volume:
              econ.calculated_cartons_45hc_per_volume,
            calculated_case_pack_45hc_per_volume:
              econ.calculated_case_pack_45hc_per_volume,
            optimal_cartons_per_45hc: econ.optimal_cartons_per_45hc,
            optimal_pieces_per_45hc: econ.optimal_pieces_per_45hc,
            logistic_cost_45hc: econ.logistic_cost_45hc,
            landed_cost_45hc: econ.landed_cost_45hc,

            // 40STD
            calculated_cartons_40std_per_volume:
              econ.calculated_cartons_40std_per_volume,
            calculated_case_pack_40std_per_volume:
              econ.calculated_case_pack_40std_per_volume,
            optimal_cartons_per_40std: econ.optimal_cartons_per_40std,
            optimal_pieces_per_40std: econ.optimal_pieces_per_40std,
            logistic_cost_40std: econ.logistic_cost_40std,
            landed_cost_40std: econ.landed_cost_40std,

            // 20STD
            calculated_cartons_20std_per_volume:
              econ.calculated_cartons_20std_per_volume,
            calculated_case_pack_20std_per_volume:
              econ.calculated_case_pack_20std_per_volume,
            optimal_cartons_per_20std: econ.optimal_cartons_per_20std,
            optimal_pieces_per_20std: econ.optimal_pieces_per_20std,
            logistic_cost_20std: econ.logistic_cost_20std,
            landed_cost_20std: econ.landed_cost_20std,

            // 53FT
            calculated_cartons_53ft_per_volume:
              econ.calculated_cartons_53ft_per_volume,
            calculated_case_pack_53ft_per_volume:
              econ.calculated_case_pack_53ft_per_volume,
            optimal_cartons_per_53ft: econ.optimal_cartons_per_53ft,
            optimal_pieces_per_53ft: econ.optimal_pieces_per_53ft,
            logistic_cost_53ft: econ.logistic_cost_53ft,
            landed_cost_53ft: econ.landed_cost_53ft
          })
          .where(eq(productViewTable.tech_sku_id, p.tech_sku_id));
      }

      logs.push('[3/5] ⚖️ Customs Duties & Section 301 tariffs mapped.');
      logs.push(
        '[4/5] 🚢 Prorated Ocean, Inland & Port charges per container.'
      );
      logs.push(
        `[5/5] 💵 Final Landed Costs generated for ${viewProducts.length} products.`
      );

      revalidatePath('/dashboard/products_view');
      const durationMs = Date.now() - startTime;
      logs.push(`✓ Calculation completed successfully in ${durationMs}ms.`);

      return {
        success: true,
        message: `${viewProducts.length} products successfully recalculated.`,
        processedCount: viewProducts.length,
        durationMs,
        logs
      };
    }

    logs.push(
      `[2/5] 📐 Calculating container economics for ${products.length} products...`
    );
    for (const p of products) {
      const econ = calculateProductEconomics(p);

      // Upsert into product_view_table
      await db
        .insert(productViewTable)
        .values({
          tech_sku_id: p.tech_sku_id,
          hemicode: p.hemicode,
          status: p.status,
          factory_code: p.factory_code,
          factory_mold: p.factory_mold,
          item_upc: p.item_upc,
          case_upc: p.case_upc,
          vendor: p.vendor,
          brand_name: p.brand_name,
          origin_country: p.origin_country,
          pre_price: p.pre_price,
          factory_name: p.factory_name,
          description: p.description,
          short_description: p.short_description,
          super_category: p.super_category,
          category: p.category,
          sub_category: p.sub_category,
          consumer_use: p.consumer_use,
          set_collection: p.set_collection,
          product_collection: p.product_collection,
          process_type: p.process_type,
          season: p.season,
          color_family: p.color_family,
          color_description: p.color_description,
          pantone_code: p.pantone_code,
          tosaf_code: p.tosaf_code,
          raw_material: p.raw_material,
          finishing: p.finishing,
          shipping_pack: p.shipping_pack,
          label: p.label,
          packing: p.packing,
          pieces_per_unit: p.pieces_per_unit,
          case_pack: p.case_pack,
          product_or_kit: p.product_or_kit,
          notes: p.notes,

          carton_length_mm: p.carton_length_mm,
          carton_height_mm: p.carton_height_mm,
          carton_width_mm: p.carton_width_mm,
          carton_weight_kg: p.carton_weight_kg,

          // Calculated economics
          ...econ
        })
        .onConflictDoUpdate({
          target: productViewTable.tech_sku_id,
          set: {
            ...econ,
            status: p.status,
            description: p.description,
            vendor: p.vendor,
            brand_name: p.brand_name,
            category: p.category
          }
        });
    }

    logs.push('[3/5] ⚖️ Customs Duties & Section 301 tariffs mapped.');
    logs.push('[4/5] 🚢 Prorated Ocean, Inland & Port charges per container.');
    logs.push(
      `[5/5] 💵 Final Landed Costs synchronized for ${products.length} products.`
    );

    revalidatePath('/dashboard/products_view');
    const durationMs = Date.now() - startTime;
    logs.push(`✓ Calculation completed successfully in ${durationMs}ms.`);

    return {
      success: true,
      message: `${products.length} products successfully recalculated.`,
      processedCount: products.length,
      durationMs,
      logs
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Error executing calculation engine',
      processedCount: 0,
      durationMs: Date.now() - startTime,
      logs: [...logs, `❌ Error: ${error?.message || 'Execution failed'}`]
    };
  }
}

export const recalculateAllProductLandedCosts = recalculateLandedCostsAction;
