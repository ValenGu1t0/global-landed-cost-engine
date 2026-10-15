import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const templatesDir = path.join(process.cwd(), 'public', 'templates');
if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true });
}

// 1. Template: Bulk Add Products (Active)
const bulkAddHeaders = [
  'hemicode',
  'origin_country',
  'vendor',
  'factory_name',
  'brand_name',
  'super_category',
  'category',
  'sub_category',
  'consumer_use',
  'season',
  'raw_material',
  'finishing',
  'packing',
  'description',
  'pieces_per_unit',
  'case_pack',
  'hts_category',
  'loading_type',
  'notes',
  'factory_mold',
  'carton_length_mm',
  'carton_height_mm',
  'carton_width_mm',
  'carton_weight_kg',
  'fob',
  'mrsp'
];

const bulkAddData = [
  bulkAddHeaders,
  [
    'DEMO-SKU-01',
    'Vietnam',
    'EastCraft Sourcing',
    'EastCraft Facility A',
    'Nordic Artisans',
    'HOME',
    'Kitchenware',
    'Cookware',
    'Kitchen',
    'ALL_YEAR',
    'Cast Iron',
    'Enamel',
    'Color Box',
    'Enamel Dutch Oven 5-Quart with Lid',
    1,
    4,
    'IRON',
    'FLOOR_LOAD',
    'Demo sample product',
    'MOLD-881',
    440,
    320,
    350,
    18.5,
    18.5,
    69.99
  ],
  [
    'DEMO-SKU-02',
    'China',
    'AeroThermal Co',
    'AeroThermal Plant 2',
    'HydroPro Gear',
    'OUTDOOR',
    'Drinkware',
    'Bottles',
    'Fitness',
    'ALL_YEAR',
    'Stainless Steel',
    'Powder Coat',
    'Color Box',
    'Vacuum Insulated Sports Water Bottle 32oz',
    1,
    24,
    'STEEL',
    'PALLETIZED',
    'Demo sample product',
    'MOLD-104',
    460,
    310,
    340,
    9.8,
    6.2,
    28.0
  ]
];

const wsBulkAdd = XLSX.utils.aoa_to_sheet(bulkAddData);
const wbBulkAdd = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wbBulkAdd, wsBulkAdd, 'Products');
XLSX.writeFile(
  wbBulkAdd,
  path.join(templatesDir, 'template_bulk_add_products.xlsx')
);

// 2. Template: Bulk Update SKU / Hemicode
const updateSkuData = [
  ['old_hemicode', 'new_hemicode'],
  ['OLD-SKU-9901', 'NEW-SKU-9901'],
  ['OLD-SKU-9902', 'NEW-SKU-9902']
];
const wsSku = XLSX.utils.aoa_to_sheet(updateSkuData);
const wbSku = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wbSku, wsSku, 'Update_SKU');
XLSX.writeFile(wbSku, path.join(templatesDir, 'template_update_sku.xlsx'));

// 3. Template: Bulk Update Attributes
const updateAttributesData = [
  [
    'hemicode',
    'description',
    'vendor',
    'brand_name',
    'category',
    'carton_length_mm',
    'carton_height_mm',
    'carton_width_mm',
    'carton_weight_kg',
    'fob',
    'mrsp'
  ],
  [
    'SKU-1001',
    'Updated Matte Ceramic Coffee Mug (Set of 4)',
    'EastCraft Sourcing',
    'Nordic Artisans',
    'Drinkware',
    420,
    240,
    310,
    8.5,
    4.9,
    21.99
  ],
  [
    'SKU-1002',
    'Updated Insulated Stainless Tumbler 24oz',
    'AeroThermal Co',
    'HydroPro Gear',
    'Drinkware',
    480,
    280,
    360,
    9.2,
    5.6,
    26.99
  ]
];
const wsAttr = XLSX.utils.aoa_to_sheet(updateAttributesData);
const wbAttr = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wbAttr, wsAttr, 'Attributes');
XLSX.writeFile(
  wbAttr,
  path.join(templatesDir, 'template_update_attributes.xlsx')
);

// 4. Template: Status Change (Activation / Deactivation)
const statusData = [['hemicode'], ['SKU-1001'], ['SKU-1002']];
const wsStatus = XLSX.utils.aoa_to_sheet(statusData);
const wbStatus = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wbStatus, wsStatus, 'Status');
XLSX.writeFile(
  wbStatus,
  path.join(templatesDir, 'template_status_change.xlsx')
);

console.log('✅ Generated 4 Excel templates in public/templates/');
