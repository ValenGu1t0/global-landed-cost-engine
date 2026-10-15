'use client';

import { FormInput } from '@/components/forms/form-input';
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
import { useState } from 'react';
import { IconEdit } from '@tabler/icons-react';

import {
  updateHTSCodeSchema,
  UpdateHTSCodeSchema
} from '../actions/update-hts-code-schema';
import { updateHTSCode } from '../actions/update-hts-code';

export default function HTSViewForm({
  initialData,
  pageTitle
}: {
  initialData: any;
  pageTitle: string;
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();

  const form = useZodForm({
    schema: updateHTSCodeSchema,
    mode: 'all',
    defaultValues: {
      hts_code: initialData?.hts_code || '',
      hts_category: initialData?.hts_category || '',
      min_value: initialData?.min_value || 0,
      max_value: initialData?.max_value || 0,
      type: initialData?.type || '',
      duty: initialData?.duty || 0,
      cost_group: initialData?.cost_group || '',
      hts_product_subtype: initialData?.hts_product_subtype || '',
      fixed_duty_per_piece: initialData?.fixed_duty_per_piece || 0,
      notes: initialData?.notes || ''
    }
  });

  const canSubmit = !form.formState.isSubmitting && form.formState.isValid;

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UpdateHTSCodeSchema) => {
      return resolveActionResult(updateHTSCode(data));
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setIsEditMode(false);
      router.refresh();
    },
    onError: (error) => {
      toast.error(`No se pudo actualizar el código HTS: ${error}`);
    }
  });

  const onSubmit: SubmitHandler<UpdateHTSCodeSchema> = async (data) => {
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
                name='hts_code'
                label='HTS Code'
                placeholder='Enter HTS Code'
                disabled
              />

              <FormInput
                control={form.control}
                name='hts_category'
                label='HTS Category'
                placeholder='Enter Category'
                required
              />

              <FormInput
                control={form.control}
                name='min_value'
                label='Min Value'
                type='number'
                required
              />

              <FormInput
                control={form.control}
                name='max_value'
                label='Max Value'
                type='number'
                required
              />

              <FormInput
                control={form.control}
                name='type'
                label='Type'
                required
              />

              <FormInput
                control={form.control}
                name='duty'
                label='Duty (%)'
                type='number'
                step='0.01'
                required
              />

              <FormInput
                control={form.control}
                name='cost_group'
                label='Cost Group'
                required
              />

              <FormInput
                control={form.control}
                name='hts_product_subtype'
                label='Product Subtype'
                required
              />

              <FormInput
                control={form.control}
                name='fixed_duty_per_piece'
                label='Fixed Duty per Piece'
                type='number'
                step='0.01'
                required
              />
            </div>

            <FormTextarea
              control={form.control}
              name='notes'
              label='Notes'
              placeholder='Enter notes or comments'
              config={{ rows: 4 }}
            />

            <div className='flex gap-4'>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Updating HTS Code...' : 'Update HTS Code'}
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
            <ReadonlyField label='HTS Code' value={initialData.hts_code} />
            <ReadonlyField label='Category' value={initialData.hts_category} />
            <ReadonlyField label='Min Value' value={initialData.min_value} />
            <ReadonlyField label='Max Value' value={initialData.max_value} />
            <ReadonlyField label='Type' value={initialData.type} />
            <ReadonlyField label='Duty' value={`${initialData.duty}%`} />
            <ReadonlyField label='Cost Group' value={initialData.cost_group} />
            <ReadonlyField
              label='Product Subtype'
              value={initialData.hts_product_subtype}
            />
            <ReadonlyField
              label='Fixed Duty per Piece'
              value={initialData.fixed_duty_per_piece}
            />
            <div className='md:col-span-2'>
              <ReadonlyField label='Notes' value={initialData.notes} />
            </div>
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
