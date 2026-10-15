'use client';

import { FormFileUpload } from '@/components/forms/form-file-upload';
import { FormInput } from '@/components/forms/form-input';
import { FormSelect } from '@/components/forms/form-select';
import { FormTextarea } from '@/components/forms/form-textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Product } from '@/db/schema';
import { resolveActionResult } from '@/lib/actions/client';
import { useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { updateProduct } from '../actions/update-product';
import { useMutation } from '@tanstack/react-query';
import {
  addProductSchema,
  AddProductSchema
} from '../actions/add-product-schema';
import { UpdateProductSchema } from '../actions/update-product-schema';
import { toast } from 'sonner';
import { useZodForm } from '@/hooks/use-zod-form';
import { useState } from 'react';
import Image from 'next/image';
import { IconEdit } from '@tabler/icons-react';
import { CATEGORIES } from '../data/constants';

export default function ProductViewForm({
  initialData,
  pageTitle
}: {
  initialData: Product;
  pageTitle: string;
}) {
  const [isEditMode, setIsEditMode] = useState(false);

  const form = useZodForm({
    schema: addProductSchema,
    mode: 'all',
    defaultValues: {
      image: undefined,
      name: initialData?.name || '',
      category: initialData?.category || '',
      price: initialData?.price || 0,
      description: initialData?.description || ''
    }
  });
  const canSubmit = !form.formState.isSubmitting && form.formState.isValid;

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UpdateProductSchema) => {
      return resolveActionResult(updateProduct(data));
    },
    onSuccess: () => {
      toast.success('Product updated successfully');
      setIsEditMode(false);
      router.refresh();
    },
    onError: (error) => {
      toast.error(`No se pudo actualizar el producto: ${error}`);
    }
  });

  const onSubmit: SubmitHandler<AddProductSchema> = async (data) => {
    if (!canSubmit) {
      return;
    }

    if (initialData) {
      const updateData: UpdateProductSchema = {
        id: initialData.id,
        ...data,
        image: data.image
      };
      mutate(updateData);
    }
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-left text-2xl font-bold'>
            {pageTitle}
          </CardTitle>
          {!isEditMode && (
            <Button
              variant='outline'
              onClick={() => setIsEditMode(true)}
              className='gap-2'
            >
              <IconEdit className='h-4 w-4' />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditMode ? (
          <Form
            form={form}
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-8'
          >
            <FormFileUpload
              control={form.control}
              name='image'
              label='Product Image'
              description='Upload a product image'
              config={{
                maxSize: 5 * 1024 * 1024,
                maxFiles: 4
              }}
            />

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormInput
                control={form.control}
                name='name'
                label='Product Name'
                placeholder='Enter product name'
                required
              />

              <FormSelect
                control={form.control}
                name='category'
                label='Category'
                placeholder='Select category'
                required
                options={CATEGORIES}
              />

              <FormInput
                control={form.control}
                name='price'
                label='Price'
                placeholder='Enter price'
                required
                type='number'
                min={0}
                step='0.01'
              />
            </div>

            <FormTextarea
              control={form.control}
              name='description'
              label='Description'
              placeholder='Enter product description'
              required
              config={{
                maxLength: 500,
                showCharCount: true,
                rows: 4
              }}
            />

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
          <div className='space-y-6'>
            {/* Image Display */}
            <div>
              <label className='mb-2 block text-sm font-medium'>
                Product Image
              </label>
              <div className='relative aspect-square w-full max-w-xs overflow-hidden rounded-lg border'>
                <Image
                  src={initialData.photo_url}
                  alt={initialData.name}
                  fill
                  className='object-cover'
                />
              </div>
            </div>

            {/* Readonly Fields */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div>
                <label className='mb-2 block text-sm font-medium'>
                  Product Name
                </label>
                <div className='bg-muted/50 rounded-md border px-3 py-2 text-sm'>
                  {initialData.name}
                </div>
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium'>
                  Category
                </label>
                <div className='bg-muted/50 rounded-md border px-3 py-2 text-sm capitalize'>
                  {initialData.category}
                </div>
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium'>Price</label>
                <div className='bg-muted/50 rounded-md border px-3 py-2 text-sm'>
                  ${initialData.price.toFixed(2)}
                </div>
              </div>
            </div>

            <div>
              <label className='mb-2 block text-sm font-medium'>
                Description
              </label>
              <div className='bg-muted/50 rounded-md border px-3 py-2 text-sm'>
                {initialData.description}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
