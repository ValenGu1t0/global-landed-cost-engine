'use client';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { ProductsViewTable } from '@/db/schema';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, XCircle } from 'lucide-react';
import { CellAction } from './cell-action';
import { format } from 'date-fns';
import Image from 'next/image';
import { resolveProductImageUrl } from '@/constants/data';

// Formateo de date para los inventory a dias
function formatDateLabel(daysToAdd: number = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);

  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Formatea un valor numérico real (decimal) para mostrar hasta 4 decimales.
const RealValueCell = ({ value }: { value: number | null | undefined }) => (
  <div className='text-center'>
    {value !== null && value !== undefined ? value.toFixed(4) : '-'}
  </div>
);

// Formatea un valor de costo con símbolo de moneda y 2 decimales.
const CostValueCell = ({ value }: { value: number | null | undefined }) => (
  <div className='text-center'>
    {value !== null && value !== undefined ? `$${value.toFixed(2)}` : '-'}
  </div>
);

export const columns: ColumnDef<ProductsViewTable>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className='flex w-full justify-center'>
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          className='cursor-pointer'
          aria-label='Select All'
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex w-full justify-center'>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          className='cursor-pointer'
          aria-label='Select Row'
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    size: 40,
    minSize: 40,
    maxSize: 40
  },

  /// === Caracteristicas del Producto === ///

  // ID de ambas tablas para cada producto
  {
    id: 'tech_sku_id',
    accessorKey: 'tech_sku_id',
    header: ({ column }: { column: Column<ProductsViewTable, unknown> }) => (
      <DataTableColumnHeader column={column} title='ID' pin={false} />
    ),
    enableHiding: false,
    size: 60
  },

  // IMAGEN
  {
    accessorKey: 'image_path',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Image' pin />
    ),
    cell: ({ row }) => {
      const imagePath = row.getValue<string>('image_path');
      const inProcess = row.original.image_in_process;

      if (!imagePath) {
        return (
          <div className='text-muted-foreground flex h-16 items-center justify-center text-xs'>
            No Image
          </div>
        );
      }

      const fullImageUrl = resolveProductImageUrl(imagePath);

      return (
        <div className='flex items-center justify-center py-1'>
          <div
            className={`relative h-16 w-16 overflow-hidden rounded-md shadow-sm ${inProcess ? 'border-2 border-yellow-400' : ''} `}
          >
            <Image
              src={fullImageUrl}
              alt={`Product Image: ${imagePath}`}
              fill
              sizes='64px'
              className='object-contain transition-all duration-300 hover:scale-105'
            />
          </div>
        </div>
      );
    },
    size: 100,
    enableSorting: false
  },
  {
    accessorKey: 'cn_code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='CN-Code' pin />
    ),
    cell: ({ row }) => {
      return <div className='font-medium'>{row.getValue('cn_code')}</div>;
    },
    size: 100,
    enableHiding: false
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' pin={false} />
    ),
    cell: ({ row }) => {
      const status = row.getValue<ProductsViewTable['status']>('status');
      const inventoryToday = row.original.inventory_today ?? 0;

      let variant:
        | 'default'
        | 'project'
        | 'sourcing'
        | 'destructive'
        | 'warning'
        | 'outline' = 'outline';

      if (status === 'ACTIVE') {
        variant = 'default';
      } else if (status === 'PROJECT') {
        variant = 'project';
      } else if (status === 'GS') {
        variant = 'sourcing';
      } else if (status === 'INACTIVE') {
        variant = 'destructive';

        // Discontinued
        if (inventoryToday > 0) {
          return (
            <div className='flex flex-col gap-1'>
              <Badge variant='warning' className='capitalize'>
                DISCONTINUED IN WH
              </Badge>
            </div>
          );
        }
      }
      return (
        <Badge variant={variant} className='capitalize'>
          {status}
        </Badge>
      );
    },
    size: 90
  },

  // --- Acciones ---
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />,
    size: 70
  },

  {
    accessorKey: 'factory_code',
    header: 'Factory Code',
    size: 110
  },
  {
    accessorKey: 'factory_mold',
    header: 'Factory Mold',
    size: 110
  },
  {
    accessorKey: 'item_upc',
    header: 'Item UPC',
    size: 150
  },
  {
    accessorKey: 'case_upc',
    header: 'Case UPC',
    size: 150
  },
  {
    accessorKey: 'vendor',
    header: 'Vendor',
    size: 100
  },
  {
    accessorKey: 'brand_name',
    header: 'Brand',
    size: 120
  },
  {
    accessorKey: 'origin_country',
    header: 'Country',
    size: 100
  },
  {
    accessorKey: 'pre_price',
    header: 'Pre Price',
    cell: ({ cell }) => {
      const isPrePriced = cell.getValue<ProductsViewTable['pre_price']>();
      const Icon = isPrePriced ? CheckCircle2 : XCircle;
      const color = isPrePriced ? 'text-green-500' : 'text-red-500';

      return (
        <div className={`flex justify-center ${color}`}>
          <Icon className='h-4 w-4' />
        </div>
      );
    },
    size: 90
  },
  {
    accessorKey: 'factory_name',
    header: 'Factory Name',
    size: 120
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' pin />
    ),
    cell: ({ row }) => {
      const val = String(row.getValue('description') ?? '');
      return (
        <div className='truncate' title={val}>
          {val}
        </div>
      );
    },
    size: 280
  },
  {
    accessorKey: 'short_description',
    header: 'Short Desc.',
    size: 190
  },
  {
    accessorKey: 'super_category',
    header: 'Super Cat.',
    size: 120
  },
  {
    accessorKey: 'category',
    header: 'Category',
    size: 120
  },
  {
    accessorKey: 'sub_category',
    header: 'Sub-Category',
    size: 120
  },
  {
    accessorKey: 'consumer_use',
    header: 'Consumer Use',
    size: 120
  },
  {
    accessorKey: 'set_collection',
    header: 'Set/Collection',
    size: 120
  },
  {
    accessorKey: 'product_collection',
    header: 'Product Collection',
    size: 150
  },
  {
    accessorKey: 'process_type',
    header: 'Process Type',
    size: 120
  },
  {
    accessorKey: 'season',
    header: 'Season',
    size: 100
  },
  {
    accessorKey: 'color_family',
    header: 'Color Family',
    size: 120
  },
  {
    accessorKey: 'color_description',
    header: 'Color Desc.'
  },
  {
    accessorKey: 'pantone_code',
    header: 'Pantone Code'
  },
  {
    accessorKey: 'tosaf_code',
    header: 'Tosaf Code'
  },
  {
    accessorKey: 'raw_material',
    header: 'Raw Material',
    size: 120
  },
  {
    accessorKey: 'finishing',
    header: 'Finishing',
    size: 120
  },
  {
    accessorKey: 'shipping_pack',
    header: 'Shipping Pack',
    size: 120
  },
  {
    accessorKey: 'label',
    header: 'Label'
  },
  {
    accessorKey: 'packing',
    header: 'Packing',
    size: 120
  },

  /// === Empaque y Paletización === ///
  {
    accessorKey: 'pieces_per_unit',
    header: 'Pcs/Unit',
    size: 90,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()}</div>
    )
  },
  {
    accessorKey: 'case_pack',
    header: 'Case Pack',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()}</div>
    )
  },
  {
    accessorKey: 'pieces_per_carton',
    header: 'Pcs/Carton',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()}</div>
    )
  },
  {
    accessorKey: 'carton_per_american_pallet',
    header: 'Cartons/Pallet',
    size: 140,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()}</div>
    )
  },
  {
    accessorKey: 'estimated_carton_per_american_pallet',
    header: 'Est. Cartons/Pallet',
    size: 160,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },

  {
    accessorKey: 'ti',
    header: 'TI (Layer)',
    size: 90,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()}</div>
    )
  },
  {
    accessorKey: 'hi',
    header: 'HI (Height)',
    size: 90,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()}</div>
    )
  },

  /// === Tipo y Notas === ///
  {
    accessorKey: 'product_or_kit',
    header: 'Type (P/K)',
    size: 100
  },
  {
    accessorKey: 'notes',
    header: 'Notes'
  },

  /// === Dimensiones del Producto (Métrico) === ///
  {
    accessorKey: 'product_length_mm',
    header: 'L (mm)',
    size: 80,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'product_height_mm',
    header: 'H (mm)',
    size: 80,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'product_width_mm',
    header: 'W (mm)',
    size: 80,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'product_weight_kg',
    header: 'Weight (kg)',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'product_volume_ml',
    header: 'Volume (ml)',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },

  /// === Dimensiones del Producto (Imperial) === ///
  {
    accessorKey: 'product_length_in',
    header: 'L (in)',
    size: 80,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'product_height_in',
    header: 'H (in)',
    size: 80,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'product_width_in',
    header: 'W (in)',
    size: 80,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'product_weight_lb',
    header: 'Weight (lb)',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'product_volume_oz',
    header: 'Volume (oz)',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },

  /// === Dimensiones del Set (Métrico/Imperial) === ///
  {
    accessorKey: 'set_length_mm',
    header: 'Set L (mm)',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'set_height_mm',
    header: 'Set H (mm)',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'set_width_mm',
    header: 'Set W (mm)',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'set_weight_kg',
    header: 'Set Wgt (kg)',
    size: 110,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'set_weight_lb',
    header: 'Set Wgt (lb)',
    size: 110,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'set_length_in',
    header: 'Set L (in)',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'set_height_in',
    header: 'Set H (in)',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'set_width_in',
    header: 'Set W (in)',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },

  /// === Dimensiones del Empaque (Caja/Cartón) === ///
  {
    accessorKey: 'carton_length_mm',
    header: 'Carton L (mm)',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'carton_height_mm',
    header: 'Carton H (mm)',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'carton_width_mm',
    header: 'Carton W (mm)',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'carton_weight_kg',
    header: 'Carton Wgt (kg)',
    size: 120,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'carton_length_in',
    header: 'Carton L (in)',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'carton_height_in',
    header: 'Carton H (in)',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'carton_width_in',
    header: 'Carton W (in)',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'carton_weight_lb',
    header: 'Carton Wgt (lb)',
    size: 120,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },

  /// === Logística de Polybag === ///
  {
    accessorKey: 'pieces_per_polybag',
    header: 'Pcs/Polybag',
    size: 110,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()}</div>
    )
  },
  {
    accessorKey: 'polybag_per_pallet',
    header: 'Polybag/Pallet',
    size: 120,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()}</div>
    )
  },
  {
    accessorKey: 'polybag_pallet_type',
    header: 'P. Pallet Type',
    size: 120
  },

  /// === Pallets por Contenedor === ///
  {
    accessorKey: 'polybag_product_pallets_per_40hc',
    header: '40HC Pallets',
    size: 120,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()}</div>
    )
  },
  {
    accessorKey: 'polybag_product_pallets_per_45hc',
    header: '45HC Pallets',
    size: 120,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()}</div>
    )
  },
  {
    accessorKey: 'polybag_product_pallets_per_40std',
    header: '40STD Pallets',
    size: 120,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()}</div>
    )
  },
  {
    accessorKey: 'polybag_product_pallets_per_20std',
    header: '20STD Pallets',
    size: 120,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()}</div>
    )
  },
  {
    accessorKey: 'polybag_product_pallets_per_53ft',
    header: '53FT Pallets',
    size: 120,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()}</div>
    )
  },

  /// === Dimensiones de Polybag (Métrico/Imperial) === ///
  {
    accessorKey: 'polybag_length_mm',
    header: 'P. L (mm)',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'polybag_width_mm',
    header: 'P. W (mm)',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'polybag_height_mm',
    header: 'P. H (mm)',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'polybag_length_in',
    header: 'P. L (in)',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'polybag_width_in',
    header: 'P. W (in)',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'polybag_height_in',
    header: 'P. H (in)',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },

  /// === Dimensiones Polybag a Caja (Métrico/Imperial) === ///
  {
    accessorKey: 'polybag_to_carton_length_mm',
    header: 'P/C L (mm)',
    size: 110,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'polybag_to_carton_width_mm',
    header: 'P/C W (mm)',
    size: 110,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'polybag_to_carton_height_mm',
    header: 'P/C H (mm)',
    size: 110,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'polybag_to_carton_length_in',
    header: 'P/C L (in)',
    size: 110,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'polybag_to_carton_width_in',
    header: 'P/C W (in)',
    size: 110,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'polybag_to_carton_height_in',
    header: 'P/C H (in)',
    size: 110,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}</div>
    )
  },

  /// === Cubicación (CBM/CFT) === ///
  {
    accessorKey: 'case_cbm',
    header: 'Case CBM',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(4)}</div>
    )
  },
  {
    accessorKey: 'cbm_const',
    header: 'CBM Const',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(4)}</div>
    )
  },
  {
    accessorKey: 'case_cft',
    header: 'Case CFT',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(4)}</div>
    )
  },

  /// === Logística Adicional === ///
  {
    accessorKey: 'loading_type',
    header: 'Loading Type',
    size: 120
  },
  {
    accessorKey: 'stacked_pallets',
    header: 'Stacked P.',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()}</div>
    )
  },
  {
    accessorKey: 'receiving_carton_per_pallet',
    header: 'Rec. Cartons/P.',
    size: 140,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()}</div>
    )
  },

  /// === HTS (Clasificación Aduanera) === ///
  {
    accessorKey: 'hts_code',
    header: ({ column }: { column: Column<ProductsViewTable, unknown> }) => (
      <DataTableColumnHeader column={column} title='HTS Code' pin />
    ),
    size: 120
  },
  {
    accessorKey: 'hts_duty',
    header: 'HTS Duty (%)',
    size: 120,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()?.toFixed(2)}%</div>
    )
  },
  {
    accessorKey: 'hts_type',
    header: 'HTS Type',
    size: 100
  },
  {
    accessorKey: 'hts_product_subtype',
    header: 'HTS Subtype',
    size: 150
  },

  /// === Costos y Fechas de Actualización (FOB, EXW, DDP, CNF) === ///

  // FOB
  {
    accessorKey: 'fob_current_cost_value',
    header: 'FOB Cost',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>${cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'fob_current_cost_start_date',
    header: 'FOB Date',
    size: 100
    /* cell: ({ cell }) => {
            const date = cell.getValue<Date>();
            return date ? format(new Date(date), 'dd/MM/yy') : '-';
        }, */
  },
  {
    accessorKey: 'fob_current_cost_update_commentary',
    header: 'FOB Comment',
    size: 200
  },

  // EXW
  {
    accessorKey: 'exw_current_cost_value',
    header: 'EXW Cost',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>${cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'exw_current_cost_start_date',
    header: 'EXW Date',
    size: 100
    /* cell: ({ cell }) => {
            const date = cell.getValue<Date>();
            return date ? format(new Date(date), 'dd/MM/yy') : '-';
        }, */
  },
  {
    accessorKey: 'exw_current_cost_update_commentary',
    header: 'EXW Comment',
    size: 200
  },

  // DDP
  {
    accessorKey: 'ddp_current_cost_value',
    header: 'DDP Cost',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>${cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'ddp_current_cost_start_date',
    header: 'DDP Date',
    size: 100
    /* cell: ({ cell }) => {
            const date = cell.getValue<Date>();
            return date ? format(new Date(date), 'dd/MM/yy') : '-';
        }, */
  },
  {
    accessorKey: 'ddp_current_cost_update_commentary',
    header: 'DDP Comment',
    size: 200
  },

  // CNF Diff
  {
    accessorKey: 'cnf_diff_current_cost_value',
    header: 'CNF Diff Cost',
    size: 120,
    cell: ({ cell }) => (
      <div className='text-center'>${cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'cnf_diff_current_cost_start_date',
    header: 'CNF Diff Date',
    size: 120
    /* cell: ({ cell }) => {
            const date = cell.getValue<Date>();
            return date ? format(new Date(date), 'dd/MM/yy') : '-';
        }, */
  },
  {
    accessorKey: 'cnf_diff_current_cost_update_commentary',
    header: 'CNF Diff Comment',
    size: 200
  },

  // CNF
  {
    accessorKey: 'cnf_current_cost_value',
    header: 'CNF Cost',
    size: 100,
    cell: ({ cell }) => (
      <div className='text-center'>${cell.getValue<number>()?.toFixed(2)}</div>
    )
  },
  {
    accessorKey: 'cnf_current_cost_start_date',
    header: 'CNF Date',
    size: 100,
    cell: ({ cell }) => {
      const date = cell.getValue<Date>();
      return date ? format(new Date(date), 'dd/MM/yy') : '-';
    }
  },
  {
    accessorKey: 'cnf_current_cost_update_commentary',
    header: 'CNF Comment',
    size: 200
  },

  /// === Costos y Aranceles === ///
  {
    accessorKey: 'mrsp',
    header: 'MRSP',
    size: 100,
    cell: ({ cell }) => <CostValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'commission_percentage',
    header: 'Comm. (%)',
    size: 100,
    cell: ({ cell }) => <RealValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'commission_amount',
    header: 'Comm. ($)',
    size: 100,
    cell: ({ cell }) => <CostValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'duty_percentage',
    header: 'Duty (%)',
    size: 100,
    cell: ({ cell }) => <RealValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'fixed_duty_per_piece',
    header: 'Fixed Duty/Pcs',
    size: 120,
    cell: ({ cell }) => <CostValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'duty_cost',
    header: 'Duty Cost',
    size: 100,
    cell: ({ cell }) => <CostValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'tariff',
    header: 'Tariff',
    size: 100,
    cell: ({ cell }) => <RealValueCell value={cell.getValue<number>()} />
  },

  /// === Limitantes de Peso === ///
  {
    accessorKey: 'max_carton_per_weight',
    header: 'Max Carton/Wgt',
    size: 130,
    cell: ({ cell }) => <RealValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'max_case_pack_per_weight',
    header: 'Max CasePack/Wgt',
    size: 140,
    cell: ({ cell }) => <RealValueCell value={cell.getValue<number>()} />
  },

  /// === Optimización de Contenedores (40HC) === ///
  {
    accessorKey: 'confirmed_carton_per_40hc',
    header: 'Confirmed C/40HC',
    size: 140,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()}</div>
    )
  },
  {
    accessorKey: 'calculated_cartons_40hc_per_volume',
    header: 'Calc C/40HC (Vol)',
    size: 140,
    cell: ({ cell }) => <RealValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'calculated_case_pack_40hc_per_volume',
    header: 'Calc CP/40HC (Vol)',
    size: 150,
    cell: ({ cell }) => <RealValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'optimal_cartons_per_40hc',
    header: 'Optimal C/40HC',
    size: 130,
    cell: ({ cell }) => <RealValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'optimal_pieces_per_40hc',
    header: 'Optimal Pcs/40HC',
    size: 140,
    cell: ({ cell }) => <RealValueCell value={cell.getValue<number>()} />
  },

  /// === Optimización de Contenedores (45HC) === ///
  {
    accessorKey: 'confirmed_carton_per_45hc',
    header: 'Confirmed C/45HC',
    size: 140,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()}</div>
    )
  },
  {
    accessorKey: 'calculated_cartons_45hc_per_volume',
    header: 'Calc C/45HC (Vol)',
    size: 140,
    cell: ({ cell }) => <RealValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'calculated_case_pack_45hc_per_volume',
    header: 'Calc CP/45HC (Vol)',
    size: 150,
    cell: ({ cell }) => <RealValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'optimal_cartons_per_45hc',
    header: 'Optimal C/45HC',
    size: 130,
    cell: ({ cell }) => <RealValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'optimal_pieces_per_45hc',
    header: 'Optimal Pcs/45HC',
    size: 140,
    cell: ({ cell }) => <RealValueCell value={cell.getValue<number>()} />
  },

  /// === Optimización de Contenedores (40STD) === ///
  {
    accessorKey: 'confirmed_carton_per_40std',
    header: 'Confirmed C/40STD',
    size: 140,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()}</div>
    )
  },
  {
    accessorKey: 'calculated_cartons_40std_per_volume',
    header: 'Calc C/40STD (Vol)',
    size: 140,
    cell: ({ cell }) => <RealValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'calculated_case_pack_40std_per_volume',
    header: 'Calc CP/40STD (Vol)',
    size: 150,
    cell: ({ cell }) => <RealValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'optimal_cartons_per_40std',
    header: 'Optimal C/40STD',
    size: 130,
    cell: ({ cell }) => <RealValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'optimal_pieces_per_40std',
    header: 'Optimal Pcs/40STD',
    size: 140,
    cell: ({ cell }) => <RealValueCell value={cell.getValue<number>()} />
  },

  /// === Optimización de Contenedores (20STD) === ///
  {
    accessorKey: 'confirmed_carton_per_20std',
    header: 'Confirmed C/20STD',
    size: 140,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()}</div>
    )
  },
  {
    accessorKey: 'calculated_cartons_20std_per_volume',
    header: 'Calc C/20STD (Vol)',
    size: 140,
    cell: ({ cell }) => <RealValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'calculated_case_pack_20std_per_volume',
    header: 'Calc CP/20STD (Vol)',
    size: 150,
    cell: ({ cell }) => <RealValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'optimal_cartons_per_20std',
    header: 'Optimal C/20STD',
    size: 130,
    cell: ({ cell }) => <RealValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'optimal_pieces_per_20std',
    header: 'Optimal Pcs/20STD',
    size: 140,
    cell: ({ cell }) => <RealValueCell value={cell.getValue<number>()} />
  },

  /// === Optimización de Contenedores (53FT) === ///
  {
    accessorKey: 'confirmed_carton_per_53ft',
    header: 'Confirmed C/53FT',
    size: 140,
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<number>()}</div>
    )
  },
  {
    accessorKey: 'calculated_cartons_53ft_per_volume',
    header: 'Calc C/53FT (Vol)',
    size: 140,
    cell: ({ cell }) => <RealValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'calculated_case_pack_53ft_per_volume',
    header: 'Calc CP/53FT (Vol)',
    size: 150,
    cell: ({ cell }) => <RealValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'optimal_cartons_per_53ft',
    header: 'Optimal C/53FT',
    size: 130,
    cell: ({ cell }) => <RealValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'optimal_pieces_per_53ft',
    header: 'Optimal Pcs/53FT',
    size: 140,
    cell: ({ cell }) => <RealValueCell value={cell.getValue<number>()} />
  },

  /// === Costos Logísticos === ///
  {
    accessorKey: 'logistic_cost_40hc',
    header: 'Log Cost (40HC)',
    size: 120,
    cell: ({ cell }) => <CostValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'logistic_cost_45hc',
    header: 'Log Cost (45HC)',
    size: 120,
    cell: ({ cell }) => <CostValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'logistic_cost_40std',
    header: 'Log Cost (40STD)',
    size: 120,
    cell: ({ cell }) => <CostValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'logistic_cost_20std',
    header: 'Log Cost (20STD)',
    size: 120,
    cell: ({ cell }) => <CostValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'logistic_cost_53ft',
    header: 'Log Cost (53FT)',
    size: 120,
    cell: ({ cell }) => <CostValueCell value={cell.getValue<number>()} />
  },

  /// === Costos Landed === ///
  {
    accessorKey: 'landed_cost_40hc',
    header: 'Landed Cost (40HC)',
    size: 140,
    cell: ({ cell }) => <CostValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'landed_cost_45hc',
    header: 'Landed Cost (45HC)',
    size: 140,
    cell: ({ cell }) => <CostValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'landed_cost_40std',
    header: 'Landed Cost (40STD)',
    size: 140,
    cell: ({ cell }) => <CostValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'landed_cost_20std',
    header: 'Landed Cost (20STD)',
    size: 140,
    cell: ({ cell }) => <CostValueCell value={cell.getValue<number>()} />
  },
  {
    accessorKey: 'landed_cost_53ft',
    header: 'Landed Cost (53FT)',
    size: 140,
    cell: ({ cell }) => <CostValueCell value={cell.getValue<number>()} />
  },

  /// === Costo Promedio (Numeric/Decimal) === ///
  {
    accessorKey: 'average_cost',
    header: 'Avg Cost',
    size: 100,
    // La columna es 'numeric' en Drizzle, lo tratamos como string para precisión,
    // aunque generalmente se convierte a number/string en la capa de datos.
    cell: ({ cell }) => (
      <CostValueCell value={parseFloat(cell.getValue<string>() || '0')} />
    )
  },

  /// === Inventory en dias === ///
  {
    accessorKey: 'inventory_today',
    header: `Inventory ${formatDateLabel(0)}`,
    size: 100
  },
  {
    accessorKey: 'inventory_today_7',
    header: `Inventory ${formatDateLabel(7)}`,
    size: 110
  },
  {
    accessorKey: 'inventory_today_14',
    header: `Inventory ${formatDateLabel(14)}`,
    size: 110
  },
  {
    accessorKey: 'inventory_today_21',
    header: `Inventory ${formatDateLabel(21)}`,
    size: 110
  },
  {
    accessorKey: 'inventory_today_49',
    header: `Inventory ${formatDateLabel(49)}`,
    size: 110
  },
  {
    accessorKey: 'inventory_today_77',
    header: `Inventory ${formatDateLabel(77)}`,
    size: 110
  },
  {
    accessorKey: 'inventory_today_105',
    header: `Inventory ${formatDateLabel(105)}`,
    size: 120
  }
];
