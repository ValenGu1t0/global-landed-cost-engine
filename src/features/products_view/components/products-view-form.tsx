'use client';

import { FormInput } from '@/components/forms/form-input';
import { FormSelect } from '@/components/forms/form-select';
import { FormTextarea } from '@/components/forms/form-textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { ProductTable } from '@/db/schema';
import { resolveActionResult } from '@/lib/actions/client';
import { useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useZodForm } from '@/hooks/use-zod-form';
import { useState } from 'react';
import { IconCopy, IconEdit } from '@tabler/icons-react';
import { Separator } from '@/components/ui/separator';
import {
  UpdateProductSchema,
  updateProductSchema
} from '../actions/update-product-schema';
import { updateProduct } from '../actions/update-product';
import { ProductImageGallery } from '@/features/products_view/components/products-image-gallery';
import {
  getProductImagesBySkuId,
  FullImageUrl
} from '../data/get-product-image-by-id';
import { FormCheckbox } from '@/components/forms/form-checkbox';
import { ProductEconomicsCard } from './product-economics-card';

type Props = {
  initialData: ProductTable;
  pageTitle: string;
  categories: { value: string; label: string }[];
};

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

type GridProps = {
  children: React.ReactNode;
};

// Definimos estos valores para convertirlos a "undefined" y no romper la logica de comentarios condicionales
const incotermFields = ['fob', 'exw', 'cnf', 'ddp', 'cnf_diff'];

const commentaryFields = [
  'fob_commentary',
  'exw_commentary',
  'cnf_commentary',
  'ddp_commentary',
  'cnf_diff_commentary'
];

// Helper para normalizar valores precargados de cada campo de cada producto en el schema
function normalizeInitialValues(obj: any) {
  const normalized: any = {};

  Object.entries(obj ?? {}).forEach(([k, v]) => {
    // Incoterms -> undefined cuando son 0 o null
    if (incotermFields.includes(k)) {
      normalized[k] = v === 0 || v === null ? undefined : v;
      return;
    }

    // Commentary -> siempre string (pero vacío al editar)
    if (commentaryFields.includes(k)) {
      normalized[k] = '';
      return;
    }

    normalized[k] = v === null ? '' : v;
  });

  return normalized;
}

// Helper para Normalizar y limpiar el formulario de CREACIÓN
function prepareDataForSessionStorage(data: ProductTable) {
  // Desestructuramos los campos que no queremos duplicar
  const { tech_sku_id, ...rest } = data;

  // null/0 se tratan como undefined/vacío.
  const normalized: any = {};
  Object.entries(rest ?? {}).forEach(([k, v]) => {
    // Los comentarios deben estar vacíos en el nuevo producto.
    if (commentaryFields.includes(k)) {
      normalized[k] = '';
      return;
    }

    // Si es null o string vacío, lo hacemos undefined (ideal para campos opcionales)
    if (v === null || v === '' || (typeof v === 'string' && v.trim() === '')) {
      normalized[k] = undefined;
      return;
    }

    // Si es un valor numérico y es 0, también lo hacemos undefined para el duplicado
    if (typeof v === 'number' && v === 0) {
      normalized[k] = undefined;
      return;
    }

    // Mantener el resto (strings, booleanos, números > 0)
    normalized[k] = v;
  });

  // Sobrescribimos
  const duplicatedData = {
    ...normalized,
    hemicode: `COPY OF ${data.hemicode}`,
    status: 'ACTIVE'
  };
  return JSON.stringify(duplicatedData);
}

// Converter de bool a Yes / No
function showValue(value: any) {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

function ReadField({
  label,
  value,
  className = ''
}: {
  label: string;
  value: any;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className='mb-2 block text-sm font-medium'>{label}</label>
      <div className='bg-muted/50 rounded-md border px-3 py-2 text-sm'>
        {showValue(value)}
      </div>
    </div>
  );
}

function Section({ title, children }: SectionProps) {
  return (
    <div className='space-y-4'>
      <h3 className='text-primary text-lg font-semibold'>{title}</h3>
      {children}
    </div>
  );
}

function Grid({ children }: GridProps) {
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>{children}</div>
  );
}

export default function ProductViewForm({
  initialData,
  pageTitle,
  categories
}: Props) {
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: imageUrls, isLoading: isImagesLoading } = useQuery<
    FullImageUrl[]
  >({
    queryKey: ['productImages', initialData.tech_sku_id],
    queryFn: () =>
      getProductImagesBySkuId({ tech_sku_id: initialData.tech_sku_id }),
    staleTime: Infinity,
    enabled: initialData.tech_sku_id > 0
  });

  const form = useZodForm({
    schema: updateProductSchema,
    mode: 'all',
    defaultValues: normalizeInitialValues(initialData)
  });

  const router = useRouter();
  const canSubmit = !form.formState.isSubmitting && form.formState.isValid;

  // Para el render condicional de commentary en los Incoterms
  const watchedValues = form.watch(['fob', 'exw', 'cnf', 'ddp', 'cnf_diff']);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UpdateProductSchema) =>
      resolveActionResult(updateProduct(data)),
    onSuccess: () => {
      toast.success('Product updated successfully');
      setIsEditMode(false);
      router.refresh();
    },
    onError: (error) => toast.error(`Couldn't update the product: ${error}`)
  });

  // Validación dinámica de commentary según cambios en Incoterms
  const validateCommentaryChanges = () => {
    const errors: string[] = [];

    const incotermFields = ['fob', 'exw', 'cnf', 'ddp', 'cnf_diff'] as const;
    const commentaryFields: Record<(typeof incotermFields)[number], string> = {
      fob: 'fob_commentary',
      exw: 'exw_commentary',
      cnf: 'cnf_commentary',
      ddp: 'ddp_commentary',
      cnf_diff: 'cnf_diff_commentary'
    };

    for (const field of incotermFields) {
      const newValue = form.getValues(field);
      const oldValue = initialData[field] ?? undefined;
      const commentary = form.getValues(commentaryFields[field]);

      const changed =
        (oldValue ?? undefined) !== (newValue === '' ? undefined : newValue);

      if (changed) {
        if (!commentary || commentary.trim() === '') {
          errors.push(
            `The commentary for ${field.toUpperCase()} is required because its value was modified.`
          );
        }
      }
    }

    return errors;
  };

  // Fun duplicación de productos en sessionStorage
  const handleDuplicate = () => {
    if (typeof window === 'undefined' || !window.sessionStorage) {
      toast.error('Session storage is not available.');
      return;
    }

    const serializedData = prepareDataForSessionStorage(initialData);

    try {
      sessionStorage.setItem('duplicatedProductData', serializedData);
      toast.info('Product data duplicated. Redirecting to creation page...');
      router.push(`/dashboard/products_view/new`);
    } catch (e) {
      toast.error(
        'Error storing data for duplication. Data might be too large for browser storage.'
      );
      console.error(e);
    }
  };

  // Modificado para validar los commentary de incoterms
  const onSubmit: SubmitHandler<UpdateProductSchema> = async (data) => {
    const commentaryErrors = validateCommentaryChanges();

    if (commentaryErrors.length > 0) {
      commentaryErrors.forEach((msg) => toast.error(msg));
      return;
    }

    if (!canSubmit) return;

    mutate({ ...data, tech_sku_id: initialData.tech_sku_id });
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-left text-2xl font-bold'>
            {pageTitle}: {initialData.hemicode}
          </CardTitle>

          <div className='flex flex-row gap-2'>
            <Button
              variant='outline'
              onClick={handleDuplicate}
              className='gap-2'
            >
              <IconCopy className='h-4 w-4' /> Duplicate
            </Button>
            {!isEditMode && (
              <Button
                variant='outline'
                onClick={() => setIsEditMode(true)}
                className='gap-2'
              >
                <IconEdit className='h-4 w-4' /> Edit
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* GALERÍA DE IMÁGENES DEL PRODUCTO */}
        <ProductImageGallery
          imageUrls={imageUrls}
          isLoading={isImagesLoading}
        />
        <Separator className='mt-6 mb-8' />

        {isEditMode ? (
          <Form
            form={form}
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            {/* ---------------- General (Edit Mode) ---------------- */}
            <Section title='General'>
              <Grid>
                <FormInput
                  control={form.control}
                  name='hemicode'
                  label='Hemicode'
                />
                <FormInput
                  control={form.control}
                  name='status'
                  label='Status'
                  disabled
                />
                <FormInput
                  control={form.control}
                  name='vendor'
                  label='Vendor'
                  required
                />
                <FormInput
                  control={form.control}
                  name='brand_name'
                  label='Brand Name'
                  required
                />
                <FormInput
                  control={form.control}
                  name='factory_name'
                  label='Factory Name'
                  required
                />
                <FormTextarea
                  control={form.control}
                  name='description'
                  label='Description'
                />
                <FormInput
                  control={form.control}
                  name='short_description'
                  label='Short Description'
                />
                <FormInput
                  control={form.control}
                  name='hts_category'
                  label='HTS Category'
                />
                <FormInput
                  control={form.control}
                  name='factory_code'
                  label='Factory Code'
                />
                <FormInput
                  control={form.control}
                  name='factory_mold'
                  label='Factory Mold'
                />
                <FormInput
                  control={form.control}
                  name='item_upc'
                  label='Item UPC'
                />
                <FormInput
                  control={form.control}
                  name='case_upc'
                  label='Case UPC'
                />
                <FormInput
                  control={form.control}
                  name='origin_country'
                  label='Origin Country'
                  required
                />
              </Grid>
            </Section>
            <Separator />
            <Section title='Categories'>
              <Grid>
                <FormInput
                  control={form.control}
                  name='super_category'
                  label='Super Category'
                />
                <FormSelect
                  control={form.control}
                  name='category'
                  label='Category'
                  options={categories}
                />
                <FormInput
                  control={form.control}
                  name='sub_category'
                  label='Sub Category'
                />
                <FormInput
                  control={form.control}
                  name='consumer_use'
                  label='Consumer Use'
                />
                <FormInput
                  control={form.control}
                  name='set_collection'
                  label='Set Collection'
                />
                <FormInput
                  control={form.control}
                  name='product_collection'
                  label='Product Collection'
                />
                <FormInput
                  control={form.control}
                  name='process_type'
                  label='Process Type'
                />
                <FormInput
                  control={form.control}
                  name='season'
                  label='Season'
                />
              </Grid>
            </Section>
            <Separator />
            <Section title='Colors'>
              <Grid>
                <FormInput
                  control={form.control}
                  name='color_family'
                  label='Color Family'
                />
                <FormInput
                  control={form.control}
                  name='color_description'
                  label='Color Description'
                />
                <FormInput
                  control={form.control}
                  name='pantone_code'
                  label='Pantone Code'
                />
                <FormInput
                  control={form.control}
                  name='tosaf_code'
                  label='Tosaf Code'
                />
              </Grid>
            </Section>
            <Separator />
            <Section title='Materials & Processes'>
              <Grid>
                <FormInput
                  control={form.control}
                  name='raw_material'
                  label='Raw Material'
                />
                <FormInput
                  control={form.control}
                  name='finishing'
                  label='Finishing'
                />
                <FormInput
                  control={form.control}
                  name='packing'
                  label='Packing'
                  required
                />
                <FormInput
                  control={form.control}
                  name='shipping_pack'
                  label='Shipping Pack'
                />
                <FormInput control={form.control} name='label' label='Label' />
              </Grid>
            </Section>
            <Separator />
            <Section title='Product Dimensions'>
              <Grid>
                <FormInput
                  control={form.control}
                  name='product_length_mm'
                  label='Length (mm)'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='product_width_mm'
                  label='Width (mm)'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='product_height_mm'
                  label='Height (mm)'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='product_weight_kg'
                  label='Weight (kg)'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='product_volume_ml'
                  label='Volume (ml)'
                  type='number'
                />
              </Grid>
            </Section>
            <Separator />
            <Section title='Packaging Dimensions'>
              <Grid>
                <FormInput
                  control={form.control}
                  name='carton_length_mm'
                  label='Carton Length (mm)'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='carton_width_mm'
                  label='Carton Width (mm)'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='carton_height_mm'
                  label='Carton Height (mm)'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='pieces_per_unit'
                  label='Pieces per Unit'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='case_pack'
                  label='Case Pack'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='pieces_per_polybag'
                  label='Pieces per Polybag'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='polybag_per_pallet'
                  label='Polybag per Pallet'
                  type='number'
                />
              </Grid>
            </Section>
            <Separator />
            <Section title='Logistics'>
              <Grid>
                <FormInput
                  control={form.control}
                  name='receiving_carton_per_pallet'
                  label='Receiving Carton per Pallet'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='ti'
                  label='TI'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='hi'
                  label='HI'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='stacked_pallets'
                  label='Stacked Pallets'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='carton_weight_kg'
                  label='Carton Weight (kg)'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='cbm'
                  label='CBM'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='vendor_pallet_lenght'
                  label='Vendor Pallet Length'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='vendor_pallet_width'
                  label='Vendor Pallet Width'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='vendor_pallet_height'
                  label='Vendor Pallet Height'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='vendor_pallet_lenght'
                  label='Vendor Pallet Length'
                  type='number'
                />
              </Grid>
            </Section>
            <Separator />

            {/* ---------------- Incoterms ---------------- */}
            <Section title='Incoterms'>
              <Grid>
                <FormInput
                  control={form.control}
                  name='fob'
                  label='FOB'
                  type='number'
                />
                {/* FOB */}
                {form.watch('fob') && (
                  <FormInput
                    control={form.control}
                    name='fob_commentary'
                    label='FOB - Commentary'
                    required
                  />
                )}

                <FormInput
                  control={form.control}
                  name='exw'
                  label='EXW'
                  type='number'
                />
                {/* EXW */}
                {form.watch('exw') && (
                  <FormInput
                    control={form.control}
                    name='exw_commentary'
                    label='EXW - Commentary'
                    required
                  />
                )}

                <FormInput
                  control={form.control}
                  name='ddp'
                  label='DDP'
                  type='number'
                />
                {/* DDP */}
                {form.watch('ddp') && (
                  <FormInput
                    control={form.control}
                    name='ddp_commentary'
                    label='DDP - Commentary'
                    required
                  />
                )}

                <FormInput
                  control={form.control}
                  name='cnf'
                  label='CNF'
                  type='number'
                />
                {/* CNF */}
                {form.watch('cnf') && (
                  <FormInput
                    control={form.control}
                    name='cnf_commentary'
                    label='CNF - Commentary'
                    required
                  />
                )}

                <FormInput
                  control={form.control}
                  name='cnf_diff'
                  label='CNF Diff'
                  type='number'
                />
                {/* CNF DIFF */}
                {form.watch('cnf_diff') && (
                  <FormInput
                    control={form.control}
                    name='cnf_diff_commentary'
                    label='CNF Diff - Commentary'
                    required
                  />
                )}
              </Grid>
            </Section>
            <Separator />

            {/* PRICING */}
            <Section title='Pricing'>
              <Grid>
                <FormInput
                  control={form.control}
                  name='mrsp'
                  label='MRSP'
                  type='number'
                />
                <FormCheckbox
                  control={form.control}
                  name='pre_price'
                  label='Pre Price (boolean)'
                />
                <FormInput
                  control={form.control}
                  name='commission_percentage'
                  label='Commission %'
                  type='number'
                />
              </Grid>
            </Section>
            <Separator />

            <Section title='Packaging / Polybag / Set'>
              <Grid>
                <FormInput
                  control={form.control}
                  name='polybag_to_carton_length_mm'
                  label='Polybag -> Carton Length (mm)'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='polybag_to_carton_width_mm'
                  label='Polybag -> Carton Width (mm)'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='polybag_to_carton_height_mm'
                  label='Polybag -> Carton Height (mm)'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='polybag_product_pallets_per_40hc'
                  label='Polybag pallets per 40hc'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='polybag_length_mm'
                  label='Polybag Length (mm)'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='polybag_width_mm'
                  label='Polybag Width (mm)'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='polybag_height_mm'
                  label='Polybag Height (mm)'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='set_length_mm'
                  label='Set Length (mm)'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='set_width_mm'
                  label='Set Width (mm)'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='set_height_mm'
                  label='Set Height (mm)'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='set_weight_kg'
                  label='Set Weight (kg)'
                  type='number'
                />
              </Grid>
            </Section>
            <Separator />
            <Section title='Other / Confirmed Cartons'>
              <Grid>
                <FormInput
                  control={form.control}
                  name='carton_per_american_pallet'
                  label='Cartons per American Pallet'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='carton_weight_kg'
                  label='Carton Weight (kg)'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='confirmed_carton_per_40hc'
                  label='Confirmed carton per 40hc'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='confirmed_carton_per_45hc'
                  label='Confirmed carton per 45hc'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='confirmed_carton_per_40std'
                  label='Confirmed carton per 40std'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='confirmed_carton_per_20std'
                  label='Confirmed carton per 20std'
                  type='number'
                />
                <FormInput
                  control={form.control}
                  name='confirmed_carton_per_53ft'
                  label='Confirmed carton per 53ft'
                  type='number'
                />
              </Grid>
            </Section>
            <Separator />
            <Section title='Notes & Flags'>
              <Grid>
                <FormInput
                  control={form.control}
                  name='project_id'
                  label='Project ID'
                />
                <FormInput
                  control={form.control}
                  name='hts_product_subtype'
                  label='HTS Product Subtype'
                />
                <FormInput
                  control={form.control}
                  name='loading_type'
                  label='Loading Type'
                />
                <FormInput
                  control={form.control}
                  name='product_or_kit'
                  label='Product or Kit'
                />
                <FormInput
                  control={form.control}
                  name='polybag_pallet_type'
                  label='Polybag Pallet Type'
                />
                <FormInput
                  control={form.control}
                  name='cbm_const'
                  label='CBM Const'
                  type='number'
                />
                <FormTextarea
                  control={form.control}
                  name='notes'
                  label='Notes'
                />
              </Grid>
            </Section>
            <Separator />

            {/* ---------------- Submit / Cancel ---------------- */}
            <div className='flex gap-4'>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Updating Product...' : 'Update Product'}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setIsEditMode(false);
                  form.reset();
                }}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </Form>
        ) : (
          // ---------- READONLY VIEW ----------
          <div className='space-y-8'>
            <ProductEconomicsCard product={initialData} />

            {/* ---------------- General (Read Mode) ---------------- */}
            <Section title='General'>
              <Grid>
                <ReadField label='Hemicode' value={initialData.hemicode} />
                <ReadField label='Status' value={initialData.status} />
                <ReadField label='Vendor' value={initialData.vendor} />
                <ReadField label='Brand Name' value={initialData.brand_name} />
                <ReadField
                  label='Factory Name'
                  value={initialData.factory_name}
                />
                <ReadField
                  label='Description'
                  value={initialData.description}
                />
                <ReadField
                  label='Short Description'
                  value={initialData.short_description}
                />
                <ReadField
                  label='HTS Category'
                  value={initialData.hts_category}
                />
                <ReadField
                  label='Factory Code'
                  value={initialData.factory_code}
                />
                <ReadField
                  label='Factory Mold'
                  value={initialData.factory_mold}
                />
                <ReadField label='Item UPC' value={initialData.item_upc} />
                <ReadField label='Case UPC' value={initialData.case_upc} />
                <ReadField
                  label='Origin Country'
                  value={initialData.origin_country}
                />
              </Grid>
            </Section>
            <Separator />
            <Section title='Categories'>
              <Grid>
                <ReadField
                  label='Super Category'
                  value={initialData.super_category}
                />
                <ReadField label='Category' value={initialData.category} />
                <ReadField
                  label='Sub Category'
                  value={initialData.sub_category}
                />
                <ReadField
                  label='Consumer Use'
                  value={initialData.consumer_use}
                />
                <ReadField
                  label='Set Collection'
                  value={initialData.set_collection}
                />
                <ReadField
                  label='Product Collection'
                  value={initialData.product_collection}
                />
                <ReadField
                  label='Process Type'
                  value={initialData.process_type}
                />
                <ReadField label='Season' value={initialData.season} />
              </Grid>
            </Section>
            <Separator />
            <Section title='Colors'>
              <Grid>
                <ReadField
                  label='Color Family'
                  value={initialData.color_family}
                />
                <ReadField
                  label='Color Description'
                  value={initialData.color_description}
                />
                <ReadField
                  label='Pantone Code'
                  value={initialData.pantone_code}
                />
                <ReadField label='Tosaf Code' value={initialData.tosaf_code} />
              </Grid>
            </Section>
            <Separator />
            <Section title='Materials & Processes'>
              <Grid>
                <ReadField
                  label='Raw Material'
                  value={initialData.raw_material}
                />
                <ReadField label='Finishing' value={initialData.finishing} />
                <ReadField label='Packing' value={initialData.packing} />
                <ReadField
                  label='Shipping Pack'
                  value={initialData.shipping_pack}
                />
                <ReadField label='Label' value={initialData.label} />
              </Grid>
            </Section>
            <Separator />
            <Section title='Product Dimensions'>
              <Grid>
                <ReadField
                  label='Length (mm)'
                  value={initialData.product_length_mm}
                />
                <ReadField
                  label='Width (mm)'
                  value={initialData.product_width_mm}
                />
                <ReadField
                  label='Height (mm)'
                  value={initialData.product_height_mm}
                />
                <ReadField
                  label='Weight (kg)'
                  value={initialData.product_weight_kg}
                />
                <ReadField
                  label='Volume (ml)'
                  value={initialData.product_volume_ml}
                />
              </Grid>
            </Section>
            <Separator />
            <Section title='Packaging Dimensions'>
              <Grid>
                <ReadField
                  label='Carton Length (mm)'
                  value={initialData.carton_length_mm}
                />
                <ReadField
                  label='Carton Width (mm)'
                  value={initialData.carton_width_mm}
                />
                <ReadField
                  label='Carton Height (mm)'
                  value={initialData.carton_height_mm}
                />
                <ReadField
                  label='Pieces per Unit'
                  value={initialData.pieces_per_unit}
                />
                <ReadField label='Case Pack' value={initialData.case_pack} />
                <ReadField label='CBM' value={initialData.cbm} />
              </Grid>
            </Section>
            <Separator />
            <Section title='Logistics'>
              <Grid>
                <ReadField
                  label='Receiving Carton per Pallet'
                  value={initialData.receiving_carton_per_pallet}
                />
                <ReadField label='TI' value={initialData.ti} />
                <ReadField label='HI' value={initialData.hi} />
                <ReadField
                  label='Stacked Pallets'
                  value={initialData.stacked_pallets}
                />
                <ReadField
                  label='Carton Weight (kg)'
                  value={initialData.carton_weight_kg}
                />
                <ReadField
                  label='Vendor Pallet Length'
                  value={initialData.vendor_pallet_lenght}
                />
                <ReadField
                  label='Vendor Pallet Width'
                  value={initialData.vendor_pallet_width}
                />
                <ReadField
                  label='Vendor Pallet Height'
                  value={initialData.vendor_pallet_height}
                />
              </Grid>
            </Section>
            <Separator />
            <Section title='Incoterms'>
              <Grid>
                <ReadField label='FOB' value={initialData.fob} />
                <ReadField label='EXW' value={initialData.exw} />
                <ReadField label='CNF' value={initialData.cnf} />
                <ReadField label='DDP' value={initialData.ddp} />
                <ReadField label='CNF Diff' value={initialData.cnf_diff} />
              </Grid>
            </Section>
            <Separator />

            <Section title='Pricing'>
              <Grid>
                <ReadField
                  label='Commission %'
                  value={initialData.commission_percentage}
                />
                <ReadField label='MRSP' value={initialData.mrsp} />
                <ReadField label='Pre Price' value={initialData.pre_price} />
              </Grid>
            </Section>
            <Separator />

            <Section title='Packaging & Sets'>
              <Grid>
                <ReadField
                  label='Polybag -> Case Length (mm)'
                  value={initialData.polybag_to_carton_length_mm}
                />
                <ReadField
                  label='Polybag -> Case Width (mm)'
                  value={initialData.polybag_to_carton_width_mm}
                />
                <ReadField
                  label='Polybag -> Case Height (mm)'
                  value={initialData.polybag_to_carton_height_mm}
                />
                <ReadField
                  label='Polybag pallets per 40hc'
                  value={initialData.polybag_product_pallets_per_40hc}
                />
                <ReadField
                  label='Polybag Length (mm)'
                  value={initialData.polybag_length_mm}
                />
                <ReadField
                  label='Polybag Width (mm)'
                  value={initialData.polybag_width_mm}
                />
                <ReadField
                  label='Polybag Height (mm)'
                  value={initialData.polybag_height_mm}
                />
                <ReadField
                  label='Set Length (mm)'
                  value={initialData.set_length_mm}
                />
                <ReadField
                  label='Set Width (mm)'
                  value={initialData.set_width_mm}
                />
                <ReadField
                  label='Set Height (mm)'
                  value={initialData.set_height_mm}
                />
                <ReadField
                  label='Set Weight (kg)'
                  value={initialData.set_weight_kg}
                />
              </Grid>
            </Section>
            <Separator />
            <Section title='Other / Confirmed Cartons'>
              <Grid>
                <ReadField
                  label='Cartons per American Pallet'
                  value={initialData.carton_per_american_pallet}
                />
                <ReadField
                  label='Confirmed carton per 40hc'
                  value={initialData.confirmed_carton_per_40hc}
                />
                <ReadField
                  label='Confirmed carton per 45hc'
                  value={initialData.confirmed_carton_per_45hc}
                />
                <ReadField
                  label='Confirmed carton per 40std'
                  value={initialData.confirmed_carton_per_40std}
                />
                <ReadField
                  label='Confirmed carton per 20std'
                  value={initialData.confirmed_carton_per_20std}
                />
                <ReadField
                  label='Confirmed carton per 53ft'
                  value={initialData.confirmed_carton_per_53ft}
                />
              </Grid>
            </Section>
            <Separator />
            <Section title='Notes & Flags'>
              <Grid>
                <ReadField label='Project ID' value={initialData.project_id} />
                <ReadField
                  label='HTS Product Subtype'
                  value={initialData.hts_product_subtype}
                />
                <ReadField
                  label='Loading Type'
                  value={initialData.loading_type}
                />
                <ReadField
                  label='Product or Kit'
                  value={initialData.product_or_kit}
                />
                <ReadField
                  label='Polybag Pallet Type'
                  value={initialData.polybag_pallet_type}
                />
                <ReadField label='CBM Const' value={initialData.cbm_const} />
                <ReadField label='Notes' value={initialData.notes} />
              </Grid>
            </Section>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
