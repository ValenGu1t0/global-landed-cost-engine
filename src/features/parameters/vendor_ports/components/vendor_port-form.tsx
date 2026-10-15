'use client';

import { FormInput } from '@/components/forms/form-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { resolveActionResult } from '@/lib/actions/client';
import { useRouter } from 'next/navigation';
import { SubmitHandler, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useZodForm } from '@/hooks/use-zod-form';
import { useState } from 'react';
import { IconEdit } from '@tabler/icons-react';

import {
  updateVendorPortSchema,
  UpdateVendorPortSchema
} from '../actions/update-vendor_port-schema';
import { updateVendorPort } from '../actions/update-vendor_port';
import { Checkbox } from '@/components/ui/checkbox';

export default function VendorPortViewForm({
  initialData,
  pageTitle
}: {
  initialData: any;
  pageTitle: string;
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();

  const form = useZodForm({
    schema: updateVendorPortSchema,
    mode: 'all',
    defaultValues: {
      id: initialData?.id,
      vendor: initialData?.vendor || '',
      country: initialData?.country || '',
      port: initialData?.port || '',
      main_port: initialData?.main_port || false
    }
  });

  const canSubmit = !form.formState.isSubmitting && form.formState.isValid;

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UpdateVendorPortSchema) =>
      resolveActionResult(updateVendorPort(data)),
    onSuccess: (data) => {
      toast.success(data.message);
      setIsEditMode(false);
      router.refresh();
    },
    onError: (error) => {
      toast.error(`No se pudo actualizar el Vendor Port: ${error}`);
    }
  });

  const onSubmit: SubmitHandler<UpdateVendorPortSchema> = async (data) => {
    if (!canSubmit) return;
    mutate(data);
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
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormInput
                control={form.control}
                name='vendor'
                label='Vendor'
                placeholder='Enter vendor'
                disabled
              />

              <FormInput
                control={form.control}
                name='country'
                label='Country'
                placeholder='Enter country'
                disabled
              />

              <FormInput
                control={form.control}
                name='port'
                label='Port'
                placeholder='Enter port'
                disabled
              />

              <Controller
                control={form.control}
                name='main_port'
                render={({ field }) => (
                  <div className='mt-6 flex items-center space-x-2'>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className='cursor-pointer'
                    />
                    <label className='font-medium'>Main Port</label>
                  </div>
                )}
              />
            </div>

            <div className='flex gap-4'>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Updating Vendor Port...' : 'Update Vendor Port'}
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
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <ReadonlyField label='Vendor' value={initialData.vendor} />
            <ReadonlyField label='Country' value={initialData.country} />
            <ReadonlyField label='Port' value={initialData.port} />
            <ReadonlyField
              label='Main Port'
              value={initialData.main_port ? 'Yes' : 'No'}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ReadonlyField({
  label,
  value
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <label className='mb-2 block text-sm font-medium'>{label}</label>
      <div className='bg-muted/50 rounded-md border px-3 py-2 text-sm'>
        {value}
      </div>
    </div>
  );
}
