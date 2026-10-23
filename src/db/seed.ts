import 'dotenv/config';
import { db } from './index';
import {
  otherParametersTable,
  htsCodesTable,
  productTable,
  productViewTable
} from './schema';
import { eq, sql } from 'drizzle-orm';
import { calculateProductEconomics } from '../lib/calculator/landed-cost-engine';

async function seed() {
  console.log('🌱 Starting database migration & seed for ConnectAR...');

  // 0. Ensure new columns exist in PostgreSQL
  await db.execute(sql`
    ALTER TABLE public.product_view_table
      ADD COLUMN IF NOT EXISTS product_length_cm real,
      ADD COLUMN IF NOT EXISTS product_height_cm real,
      ADD COLUMN IF NOT EXISTS product_width_cm real,
      ADD COLUMN IF NOT EXISTS landed_cost_usa real,
      ADD COLUMN IF NOT EXISTS landed_cost_canada real,
      ADD COLUMN IF NOT EXISTS landed_cost_france real,
      ADD COLUMN IF NOT EXISTS landed_cost_morocco real,
      ADD COLUMN IF NOT EXISTS landed_cost_israel real;
  `);

  await db.execute(sql`
    ALTER TABLE public.product
      ADD COLUMN IF NOT EXISTS product_length_cm real,
      ADD COLUMN IF NOT EXISTS product_width_cm real,
      ADD COLUMN IF NOT EXISTS product_height_cm real,
      ADD COLUMN IF NOT EXISTS product_length_in real,
      ADD COLUMN IF NOT EXISTS product_width_in real,
      ADD COLUMN IF NOT EXISTS product_height_in real,
      ADD COLUMN IF NOT EXISTS landed_cost_usa real,
      ADD COLUMN IF NOT EXISTS landed_cost_canada real,
      ADD COLUMN IF NOT EXISTS landed_cost_france real,
      ADD COLUMN IF NOT EXISTS landed_cost_morocco real,
      ADD COLUMN IF NOT EXISTS landed_cost_israel real;
  `);
  console.log('✅ Schema columns verified/added.');

  // 1. Seed System Parameters
  console.log('📦 Seeding system logistics parameters...');
  await db
    .insert(otherParametersTable)
    .values([
      {
        parameter: 'max_capacity_40hc_cbm',
        value: 68.0,
        cost_group: 'LOGISTIC'
      },
      {
        parameter: 'max_capacity_45hc_cbm',
        value: 76.0,
        cost_group: 'LOGISTIC'
      },
      {
        parameter: 'max_capacity_40std_cbm',
        value: 58.0,
        cost_group: 'LOGISTIC'
      },
      {
        parameter: 'max_capacity_20std_cbm',
        value: 28.0,
        cost_group: 'LOGISTIC'
      },
      {
        parameter: 'max_capacity_53ft_cbm',
        value: 110.0,
        cost_group: 'LOGISTIC'
      },
      {
        parameter: 'maximum_weight_in_container',
        value: 26000.0,
        cost_group: 'LOGISTIC'
      },
      {
        parameter: 'habour_maintenance_fee',
        value: 0.00125,
        cost_group: 'PORT'
      },
      {
        parameter: 'merchandise_processing_fee',
        value: 0.003464,
        cost_group: 'PORT'
      }
    ])
    .onConflictDoNothing();

  // 2. Seed Standard HTS Codes
  console.log('🏷️ Seeding international HTS codes...');
  await db
    .insert(htsCodesTable)
    .values([
      {
        hts_code: '6912.00.4810',
        hts_category: 'CERAMIC',
        duty: 4.5,
        type: 'DUTY_PCT',
        hts_product_subtype: 'Ceramic Tableware & Mugs',
        cost_group: 'CUSTOMS',
        notes: 'Standard tableware duty'
      },
      {
        hts_code: '7323.93.0080',
        hts_category: 'STEEL',
        duty: 3.4,
        type: 'DUTY_PCT',
        hts_product_subtype: 'Stainless Steel Tumblers & Flasks',
        cost_group: 'CUSTOMS',
        notes: 'Double-walled vacuum insulated'
      },
      {
        hts_code: '4419.90.9100',
        hts_category: 'WOOD',
        duty: 3.2,
        type: 'DUTY_PCT',
        hts_product_subtype: 'Bamboo & Wooden Kitchenware',
        cost_group: 'CUSTOMS',
        notes: 'Eco-friendly kitchen products'
      },
      {
        hts_code: '3924.10.4000',
        hts_category: 'PLASTIC',
        duty: 3.4,
        type: 'DUTY_PCT',
        hts_product_subtype: 'Silicone & Polymer Cookware',
        cost_group: 'CUSTOMS',
        notes: 'Food contact grade silicone'
      },
      {
        hts_code: '4202.92.3120',
        hts_category: 'TEXTILE',
        duty: 4.5,
        type: 'DUTY_PCT',
        hts_product_subtype: 'Storage Organizers & Fabric Bins',
        cost_group: 'CUSTOMS',
        notes: 'Foldable storage cubes'
      },
      {
        hts_code: '7013.37.2000',
        hts_category: 'GLASS',
        duty: 6.0,
        type: 'DUTY_PCT',
        hts_product_subtype: 'Tempered Drinking Glassware',
        cost_group: 'CUSTOMS',
        notes: 'Mercosur / Brazil glassware import tariff'
      }
    ])
    .onConflictDoNothing();

  // 3. Seed Realistic Products
  console.log('🚢 Calculating container economics and seeding products...');

  const sampleProducts = [
    {
      tech_sku_id: 1001,
      cn_code: 'SKU-1001',
      status: 'ACTIVE',
      vendor: 'EastCraft Sourcing',
      brand_name: 'Nordic Artisans',
      origin_country: 'Vietnam',
      factory_name: 'EastCraft Ceramic Works',
      description: 'Matte Ceramic Coffee Mug (Set of 4) with Ergonomic Handle',
      short_description: 'Ceramic Mug 4-Pack',
      super_category: 'HOME',
      category: 'Drinkware',
      sub_category: 'Mugs',
      consumer_use: 'Kitchen',
      season: 'ALL_YEAR',
      color_family: 'Charcoal / Sand',
      raw_material: 'Ceramic Stoneware',
      packing: 'Gift Box',
      pieces_per_unit: 4,
      case_pack: 6,
      carton_length_mm: 420,
      carton_height_mm: 240,
      carton_width_mm: 310,
      carton_weight_kg: 8.5,
      hts_code: '6912.00.4810',
      hts_duty: 4.5,
      fob_current_cost_value: 4.8,
      mrsp: 19.99,
      tariff: 0.0,
      image_path:
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80'
    },
    {
      tech_sku_id: 1002,
      cn_code: 'SKU-1002',
      status: 'ACTIVE',
      vendor: 'AeroThermal Co',
      brand_name: 'HydroPro Gear',
      origin_country: 'China',
      factory_name: 'Zhejiang AeroThermal Plant 3',
      description:
        'Double-Wall Insulated Stainless Tumbler 24oz with Leakproof Straw Lid',
      short_description: 'Insulated Tumbler 24oz',
      super_category: 'OUTDOOR',
      category: 'Drinkware',
      sub_category: 'Tumblers',
      consumer_use: 'Travel',
      season: 'SPRING_SUMMER',
      color_family: 'Midnight Navy',
      raw_material: '18/8 Stainless Steel',
      packing: 'Color Box',
      pieces_per_unit: 1,
      case_pack: 24,
      carton_length_mm: 480,
      carton_height_mm: 280,
      carton_width_mm: 360,
      carton_weight_kg: 9.2,
      hts_code: '7323.93.0080',
      hts_duty: 3.4,
      fob_current_cost_value: 5.4,
      mrsp: 24.99,
      tariff: 7.5,
      image_path:
        'https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=600&auto=format&fit=crop&q=80'
    },
    {
      tech_sku_id: 1003,
      cn_code: 'SKU-1003',
      status: 'ACTIVE',
      vendor: 'GreenRoot Manufacturing',
      brand_name: 'PureKitchen',
      origin_country: 'Vietnam',
      factory_name: 'Binh Duong EcoWood Facility',
      description:
        'Organic Bamboo Cutting Board with Juice Groove and Grip Handles',
      short_description: 'Bamboo Cutting Board',
      super_category: 'HOME',
      category: 'Kitchenware',
      sub_category: 'Prep Boards',
      consumer_use: 'Kitchen',
      season: 'ALL_YEAR',
      color_family: 'Natural Amber',
      raw_material: '100% Moso Bamboo',
      packing: 'Shrink Wrap + Sleeve',
      pieces_per_unit: 1,
      case_pack: 10,
      carton_length_mm: 460,
      carton_height_mm: 220,
      carton_width_mm: 320,
      carton_weight_kg: 14.5,
      hts_code: '4419.90.9100',
      hts_duty: 3.2,
      fob_current_cost_value: 6.2,
      mrsp: 29.99,
      tariff: 0.0,
      image_path:
        'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80'
    },
    {
      tech_sku_id: 1004,
      cn_code: 'SKU-1004',
      status: 'ACTIVE',
      vendor: 'Apex Cookware Ltd',
      brand_name: 'ChefPrecision',
      origin_country: 'India',
      factory_name: 'Apex Polymer Innovations',
      description:
        'Heat-Resistant Silicone Cooking Utensils Set (10 Pcs) with Wooden Handles',
      short_description: 'Silicone Utensil Set 10pc',
      super_category: 'HOME',
      category: 'Kitchenware',
      sub_category: 'Utensils',
      consumer_use: 'Cooking',
      season: 'ALL_YEAR',
      color_family: 'Sage Green',
      raw_material: 'Food-grade Silicone + Acacia Wood',
      packing: 'Display Gift Box',
      pieces_per_unit: 10,
      case_pack: 12,
      carton_length_mm: 520,
      carton_height_mm: 300,
      carton_width_mm: 380,
      carton_weight_kg: 11.0,
      hts_code: '3924.10.4000',
      hts_duty: 3.4,
      fob_current_cost_value: 7.5,
      mrsp: 34.99,
      tariff: 0.0,
      image_path:
        'https://images.unsplash.com/photo-1590794056461-96860f4eb120?w=600&auto=format&fit=crop&q=80'
    },
    {
      tech_sku_id: 1005,
      cn_code: 'SKU-1005',
      status: 'PROJECT',
      vendor: 'Nordic Living Essentials',
      brand_name: 'OrganizeIt',
      origin_country: 'China',
      factory_name: 'Qingdao HomeTex Mills',
      description:
        'Heavy-Duty Collapsible Fabric Storage Cubes (Pack of 6) with Dual Handles',
      short_description: 'Fabric Storage Bins 6pk',
      super_category: 'HOME',
      category: 'Storage',
      sub_category: 'Organizers',
      consumer_use: 'Closet & Shelf',
      season: 'ALL_YEAR',
      color_family: 'Heather Grey',
      raw_material: 'Reinforced Linen Non-Woven',
      packing: 'Flat Polybag + Insert',
      pieces_per_unit: 6,
      case_pack: 8,
      carton_length_mm: 400,
      carton_height_mm: 260,
      carton_width_mm: 300,
      carton_weight_kg: 7.8,
      hts_code: '4202.92.3120',
      hts_duty: 4.5,
      fob_current_cost_value: 3.9,
      mrsp: 21.99,
      tariff: 7.5,
      image_path:
        'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80'
    },
    {
      tech_sku_id: 1006,
      cn_code: 'SKU-1006',
      status: 'ACTIVE',
      vendor: 'CristalSul Brasil',
      brand_name: 'VitroBrasil',
      origin_country: 'Brazil',
      factory_name: 'São Paulo Glassworks Plant 1',
      description:
        'Tempered Crystal Drinking Glasses Commercial Pack (Pallet Case of 120 Pcs)',
      short_description: 'Brazilian Glassware Case 120pc',
      super_category: 'HOME',
      category: 'Drinkware',
      sub_category: 'Glassware',
      consumer_use: 'Hospitality & Retail',
      season: 'ALL_YEAR',
      color_family: 'Crystal Clear',
      raw_material: 'Tempered Soda-Lime Glass',
      packing: 'Export Master Pallet Box',
      pieces_per_unit: 1,
      case_pack: 1,
      product_length_mm: 780,
      product_width_mm: 580,
      product_height_mm: 480,
      product_weight_kg: 34.0,
      carton_length_mm: 800,
      carton_height_mm: 500,
      carton_width_mm: 600,
      carton_weight_kg: 36.0,
      hts_code: '7013.37.2000',
      hts_duty: 6.0,
      exw_current_cost_value: 94.79,
      fob_current_cost_value: 100.0,
      mrsp: 229.99,
      tariff: 0.0,
      image_path:
        'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80'
    }
  ];

  for (const prod of sampleProducts) {
    const economics = calculateProductEconomics(prod);
    const { base_cost, tariff_cost, ...viewEconomics } = economics;

    // 1. Insert into productTable
    await db
      .insert(productTable)
      .values({
        tech_sku_id: prod.tech_sku_id,
        cn_code: prod.cn_code,
        status: prod.status,
        vendor: prod.vendor,
        brand_name: prod.brand_name,
        origin_country: prod.origin_country,
        factory_name: prod.factory_name,
        description: prod.description,
        short_description: prod.short_description,
        super_category: prod.super_category,
        category: prod.category,
        sub_category: prod.sub_category,
        consumer_use: prod.consumer_use,
        season: prod.season,
        color_family: prod.color_family,
        raw_material: prod.raw_material,
        packing: prod.packing,
        pieces_per_unit: prod.pieces_per_unit,
        case_pack: prod.case_pack,
        product_length_mm: economics.product_length_mm,
        product_width_mm: economics.product_width_mm,
        product_height_mm: economics.product_height_mm,
        product_length_cm: economics.product_length_cm,
        product_width_cm: economics.product_width_cm,
        product_height_cm: economics.product_height_cm,
        product_length_in: economics.product_length_in,
        product_width_in: economics.product_width_in,
        product_height_in: economics.product_height_in,
        product_weight_kg: economics.product_weight_kg,
        carton_length_mm: prod.carton_length_mm,
        carton_height_mm: prod.carton_height_mm,
        carton_width_mm: prod.carton_width_mm,
        carton_weight_kg: prod.carton_weight_kg,
        fob: economics.fob_current_cost_value,
        exw: economics.exw_current_cost_value,
        cnf: economics.cnf_current_cost_value,
        cnf_diff: economics.cnf_diff_current_cost_value,
        ddp: economics.ddp_current_cost_value,
        mrsp: prod.mrsp,
        cbm: economics.case_cbm,
        landed_cost_usa: economics.landed_cost_usa,
        landed_cost_canada: economics.landed_cost_canada,
        landed_cost_france: economics.landed_cost_france,
        landed_cost_morocco: economics.landed_cost_morocco,
        landed_cost_israel: economics.landed_cost_israel
      })
      .onConflictDoUpdate({
        target: productTable.tech_sku_id,
        set: {
          cn_code: prod.cn_code,
          status: prod.status,
          description: prod.description,
          vendor: prod.vendor,
          origin_country: prod.origin_country,
          product_length_mm: economics.product_length_mm,
          product_width_mm: economics.product_width_mm,
          product_height_mm: economics.product_height_mm,
          product_length_cm: economics.product_length_cm,
          product_width_cm: economics.product_width_cm,
          product_height_cm: economics.product_height_cm,
          product_length_in: economics.product_length_in,
          product_width_in: economics.product_width_in,
          product_height_in: economics.product_height_in,
          product_weight_kg: economics.product_weight_kg,
          fob: economics.fob_current_cost_value,
          exw: economics.exw_current_cost_value,
          cnf: economics.cnf_current_cost_value,
          cnf_diff: economics.cnf_diff_current_cost_value,
          ddp: economics.ddp_current_cost_value,
          mrsp: prod.mrsp,
          cbm: economics.case_cbm,
          landed_cost_usa: economics.landed_cost_usa,
          landed_cost_canada: economics.landed_cost_canada,
          landed_cost_france: economics.landed_cost_france,
          landed_cost_morocco: economics.landed_cost_morocco,
          landed_cost_israel: economics.landed_cost_israel
        }
      });

    // 2. Insert into productViewTable with full calculations
    await db
      .insert(productViewTable)
      .values({
        tech_sku_id: prod.tech_sku_id,
        cn_code: prod.cn_code,
        status: prod.status,
        vendor: prod.vendor,
        brand_name: prod.brand_name,
        origin_country: prod.origin_country,
        factory_name: prod.factory_name,
        description: prod.description,
        short_description: prod.short_description,
        super_category: prod.super_category,
        category: prod.category,
        sub_category: prod.sub_category,
        consumer_use: prod.consumer_use,
        season: prod.season,
        color_family: prod.color_family,
        raw_material: prod.raw_material,
        packing: prod.packing,
        pieces_per_unit: prod.pieces_per_unit,
        case_pack: prod.case_pack,
        carton_length_mm: prod.carton_length_mm,
        carton_height_mm: prod.carton_height_mm,
        carton_width_mm: prod.carton_width_mm,
        carton_weight_kg: prod.carton_weight_kg,
        hts_code: prod.hts_code,
        hts_duty: prod.hts_duty,
        mrsp: prod.mrsp,
        image_path: prod.image_path,
        inventory_today: 1420,
        inventory_today_7: 1200,
        inventory_today_14: 980,
        inventory_today_21: 750,
        ...viewEconomics
      })
      .onConflictDoUpdate({
        target: productViewTable.tech_sku_id,
        set: {
          cn_code: prod.cn_code,
          status: prod.status,
          description: prod.description,
          vendor: prod.vendor,
          brand_name: prod.brand_name,
          origin_country: prod.origin_country,
          category: prod.category,
          image_path: prod.image_path,
          ...viewEconomics
        }
      });

    console.log(
      `✓ [${prod.cn_code}] (${prod.origin_country}) EXW $${economics.exw_current_cost_value} -> FOB $${economics.fob_current_cost_value} -> USA $${economics.landed_cost_usa} | CAN $${economics.landed_cost_canada} | FRA $${economics.landed_cost_france} | MAR $${economics.landed_cost_morocco} | ISR $${economics.landed_cost_israel}`
    );
  }

  // 4. Backfill any other existing rows in product_view_table & product
  const allViewRows = await db.select().from(productViewTable);
  for (const row of allViewRows) {
    const economics = calculateProductEconomics(row);
    const { base_cost, tariff_cost, ...viewEconomics } = economics;

    await db
      .update(productViewTable)
      .set(viewEconomics)
      .where(eq(productViewTable.tech_sku_id, row.tech_sku_id));

    await db
      .update(productTable)
      .set({
        product_length_mm: economics.product_length_mm,
        product_width_mm: economics.product_width_mm,
        product_height_mm: economics.product_height_mm,
        product_length_cm: economics.product_length_cm,
        product_width_cm: economics.product_width_cm,
        product_height_cm: economics.product_height_cm,
        product_length_in: economics.product_length_in,
        product_width_in: economics.product_width_in,
        product_height_in: economics.product_height_in,
        product_weight_kg: economics.product_weight_kg,
        fob: economics.fob_current_cost_value,
        exw: economics.exw_current_cost_value,
        cnf: economics.cnf_current_cost_value,
        cnf_diff: economics.cnf_diff_current_cost_value,
        ddp: economics.ddp_current_cost_value,
        cbm: economics.case_cbm,
        landed_cost_usa: economics.landed_cost_usa,
        landed_cost_canada: economics.landed_cost_canada,
        landed_cost_france: economics.landed_cost_france,
        landed_cost_morocco: economics.landed_cost_morocco,
        landed_cost_israel: economics.landed_cost_israel
      })
      .where(eq(productTable.tech_sku_id, row.tech_sku_id));
  }

  console.log('🎉 Seed completed successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
