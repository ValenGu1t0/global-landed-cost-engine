'use client';

import { FormInput } from '@/components/forms/form-input';
import { FormSelect } from '@/components/forms/form-select';
import { FormTextarea } from '@/components/forms/form-textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { resolveActionResult } from '@/lib/actions/client';
import { useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useZodForm } from '@/hooks/use-zod-form';
import { Separator } from '@/components/ui/separator';
import {
  AddProductSchema,
  addProductSchema
} from '../actions/add-product-schema';
import { addProduct } from '../actions/add-product';
import { FormCheckbox } from '@/components/forms/form-checkbox';
import { Status } from '@/constants/data';
import { useEffect } from 'react';

type Props = {
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

export default function ProductsViewNewForm({ categories, pageTitle }: Props) {
  // Contemplamos la duplicación
  const cleanDefaultValues: Partial<AddProductSchema> = {
    cn_code: '',
    hts_category: '',
    status: 'ACTIVE',
    factory_code: '',
    factory_mold: '',
    item_upc: '',
    case_upc: '',
    origin_country: '',
    vendor: '',
    brand_name: '',
    factory_name: '',
    description: '',
    short_description: '',
    super_category: '',
    category: '',
    sub_category: '',
    consumer_use: '',
    set_collection: '',
    product_collection: '',
    process_type: '',
    season: '',
    color_family: '',
    color_description: '',
    tosaf_code: '',
    pantone_code: '',
    raw_material: '',
    finishing: '',
    packing: '',
    shipping_pack: '',
    label: '',
    pieces_per_unit: 1,
    case_pack: 1,
    receiving_carton_per_pallet: undefined,
    ti: undefined,
    hi: undefined,

    fob: undefined,
    fob_commentary: '',
    exw: undefined,
    exw_commentary: '',
    cnf: undefined,
    cnf_commentary: '',
    ddp: undefined,
    ddp_commentary: '',
    cnf_diff: undefined,
    cnf_diff_commentary: '',

    product_length_mm: undefined,
    product_width_mm: undefined,
    product_height_mm: undefined,
    product_weight_kg: undefined,
    product_volume_ml: undefined,
    carton_length_mm: undefined,
    carton_width_mm: undefined,
    carton_height_mm: undefined,
    pieces_per_polybag: undefined,
    polybag_per_pallet: undefined,
    carton_weight_kg: undefined,
    vendor_pallet_lenght: undefined,
    vendor_pallet_width: undefined,
    commission_percentage: undefined,
    stacked_pallets: undefined,
    pre_price: false,
    carton_per_american_pallet: undefined,
    loading_type: '',
    hts_product_subtype: '',
    polybag_to_carton_length_mm: undefined,
    polybag_to_carton_width_mm: undefined,
    polybag_to_carton_height_mm: undefined,
    polybag_product_pallets_per_40hc: undefined,
    polybag_length_mm: undefined,
    polybag_width_mm: undefined,
    polybag_height_mm: undefined,
    set_length_mm: undefined,
    set_width_mm: undefined,
    set_height_mm: undefined,
    notes: '',
    polybag_product_pallets_per_53ft: undefined,
    polybag_pallet_type: '',
    mrsp: undefined,
    cbm: undefined,
    cbm_const: 0,
    product_or_kit: 'PRODUCT',
    confirmed_carton_per_40hc: undefined,
    confirmed_carton_per_45hc: undefined,
    confirmed_carton_per_40std: undefined,
    confirmed_carton_per_20std: undefined,
    confirmed_carton_per_53ft: undefined,
    project_id: '',
    set_weight_kg: undefined,
    image_in_process: false,
    vendor_pallet_height: undefined,
    polybag_product_pallets_per_45hc: undefined,
    polybag_product_pallets_per_40std: undefined,
    polybag_product_pallets_per_20std: undefined
  };

  const form = useZodForm({
    schema: addProductSchema,
    mode: 'all',
    defaultValues: cleanDefaultValues as AddProductSchema
  });

  // Recuperamos los datos del sessionStorage si es para duplicados
  useEffect(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const storedData = sessionStorage.getItem('duplicatedProductData');

      if (storedData) {
        try {
          const data = JSON.parse(storedData);

          // Limpiamos desp de recuperar
          sessionStorage.removeItem('duplicatedProductData');
          form.reset(data as any, {
            keepDefaultValues: false,
            keepDirty: false,
            keepIsValid: true
          });
          toast.success('Product data successfully pre-filled from duplicate.');
        } catch (e) {
          console.error('Failed to parse stored product data:', e);
          toast.error('Could not load duplicated product data.');
        }
      }
    }
  }, [form]);

  const router = useRouter();
  const canSubmit = !form.formState.isSubmitting && form.formState.isValid;

  // Dropdown de categorias
  const statusOptions = Object.values(Status).map((s) => ({
    label: s,
    value: s
  }));

  // Para el render condicional de commentary en los Incoterms
  const watchedValues = form.watch(['fob', 'exw', 'cnf', 'ddp', 'cnf_diff']);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: AddProductSchema) =>
      resolveActionResult(addProduct(data)),
    onSuccess: () => {
      toast.success('Product created successfully');
      router.push('/dashboard/products_view');
      router.refresh();
    },
    onError: (error) => toast.error(`Couldn't create the product: ${error}`)
  });

  const onSubmit: SubmitHandler<AddProductSchema> = async (data) => {
    if (!canSubmit) {
      return;
    }
    mutate(data);
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'
        >
          {/* ---------------- General ---------------- */}
          <Section title='General'>
            <Grid>
              <FormInput
                control={form.control}
                name='cn_code'
                label='CN-Code'
              />
              <FormSelect
                control={form.control}
                name='status'
                label='Status'
                options={statusOptions}
                required
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
                required
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

          {/* ---------------- Categories ---------------- */}
          <Section title='Categories'>
            <Grid>
              <FormInput
                control={form.control}
                name='super_category'
                label='Super Category'
                required
              />
              <FormSelect
                control={form.control}
                name='category'
                label='Category'
                options={categories}
                required
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
              <FormInput control={form.control} name='season' label='Season' />
            </Grid>
          </Section>
          <Separator />

          {/* ---------------- Colors ---------------- */}
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

          {/* ---------------- Materials & Process ---------------- */}
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

          {/* ---------------- Product Dimensions ---------------- */}
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

          {/* ---------------- Packaging Dimensions ---------------- */}
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
                required
              />
              <FormInput
                control={form.control}
                name='case_pack'
                label='Case Pack'
                type='number'
                required
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
              <FormInput
                control={form.control}
                name='cbm'
                label='CBM'
                type='number'
              />
            </Grid>
          </Section>
          <Separator />

          {/* ---------------- Logistics ---------------- */}
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
              {/* Se repite vendor_pallet_lenght en el original, lo ignoro aquí ya que es redundante */}
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

          {/* ---------------- Packaging / Polybag / Set ---------------- */}
          <Section title='Packaging / Polybag / Set'>
            <Grid>
              <FormInput
                control={form.control}
                name='polybag_to_carton_length_mm'
                label='Polybag -> Case Length (mm)'
                type='number'
              />
              <FormInput
                control={form.control}
                name='polybag_to_carton_width_mm'
                label='Polybag -> Case Width (mm)'
                type='number'
              />
              <FormInput
                control={form.control}
                name='polybag_to_carton_height_mm'
                label='Polybag -> Case Height (mm)'
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
              <FormInput
                control={form.control}
                name='polybag_product_pallets_per_53ft'
                label='Polybag pallets per 53ft'
                type='number'
              />
              <FormInput
                control={form.control}
                name='polybag_product_pallets_per_45hc'
                label='Polybag pallets per 45hc'
                type='number'
              />
              <FormInput
                control={form.control}
                name='polybag_product_pallets_per_40std'
                label='Polybag pallets per 40std'
                type='number'
              />
              <FormInput
                control={form.control}
                name='polybag_product_pallets_per_20std'
                label='Polybag pallets per 20std'
                type='number'
              />
            </Grid>
          </Section>
          <Separator />

          {/* ---------------- Other / Confirmed Cartons ---------------- */}
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

          {/* ---------------- Notes & Flags ---------------- */}
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
                required
              />
              <FormCheckbox
                control={form.control}
                name='image_in_process'
                label='Image In Process'
              />
              <FormTextarea control={form.control} name='notes' label='Notes' />
            </Grid>
          </Section>
          <Separator />

          {/* ---------------- Submit / Cancel ---------------- */}
          <div className='flex gap-4'>
            <Button type='submit' disabled={isPending}>
              {isPending ? 'Creating Product...' : 'Create Product'}
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                form.reset();
                // Opcional: Redirigir o navegar de vuelta
                // router.back();
              }}
              disabled={isPending}
            >
              Reset Form
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
