'use client';

import { FormInput } from '@/components/forms/form-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { GroundFreight } from '@/db/schema';
import { resolveActionResult } from '@/lib/actions/client';
import { useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useZodForm } from '@/hooks/use-zod-form';
import { useEffect, useState } from 'react';
import { IconEdit } from '@tabler/icons-react';

import {
  UpdateGroundFreightSchema,
  updateGroundFreightSchema
} from '../actions/update-ground-freight-schema';
import { updateGroundFreight } from '../actions/update-ground-freight';

export default function GroundFreightViewForm({
  initialData,
  pageTitle
}: {
  initialData: GroundFreight;
  pageTitle: string;
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isRecordEditable, setIsRecordEditable] = useState(false);

  const router = useRouter();

  // 🔥 SAME EDITABILITY LOGIC AS YOUR EXAMPLE
  useEffect(() => {
    const checkEditability = () => {
      if (initialData.start_date && initialData.end_date) {
        const startDate = new Date(initialData.start_date);
        const endDate = new Date(initialData.end_date);
        const today = new Date();

        const isStartDateToday =
          startDate.toDateString() === today.toDateString();
        const isEndDate2100 = endDate.getFullYear() === 2100;

        setIsRecordEditable(isStartDateToday && isEndDate2100);
      } else {
        setIsRecordEditable(false);
      }
    };

    checkEditability();
  }, [initialData.start_date, initialData.end_date]);

  const form = useZodForm({
    schema: updateGroundFreightSchema,
    mode: 'all',
    defaultValues: {
      id: initialData.id,
      vendor: initialData.vendor || '',
      factory_name: initialData.factory_name || '',
      origin_country: initialData.origin_country || '',
      destination_country: initialData.destination_country || '',
      destination_warehouse: initialData.destination_warehouse || '',
      container_type: initialData.container_type || '',
      cost_detail: initialData.cost_detail || '',
      value: initialData.value || 0,
      cost_group: initialData.cost_group || ''
    }
  });

  const canSubmit = !form.formState.isSubmitting && form.formState.isValid;

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UpdateGroundFreightSchema) => {
      return resolveActionResult(updateGroundFreight(data));
    },
    onSuccess: () => {
      toast.success('Ground Freight updated successfully');
      setIsEditMode(false);
      router.refresh();
    },
    onError: (error) => {
      toast.error(`No se pudo actualizar: ${error.message}`);
    }
  });

  const onSubmit: SubmitHandler<UpdateGroundFreightSchema> = async (data) => {
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

          {/* 🔥 BUTTON SHOWS ONLY IF RECORD IS EDITABLE */}
          {!isEditMode && isRecordEditable && (
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
                disabled
              />
              <FormInput
                control={form.control}
                name='factory_name'
                label='Factory Name'
                disabled
              />
              <FormInput
                control={form.control}
                name='origin_country'
                label='Origin Country'
                disabled
              />
              <FormInput
                control={form.control}
                name='destination_country'
                label='Destination Country'
                disabled
              />
              <FormInput
                control={form.control}
                name='destination_warehouse'
                label='Destination Warehouse'
                disabled
              />
              <FormInput
                control={form.control}
                name='container_type'
                label='Container Type'
                disabled
              />
              <FormInput
                control={form.control}
                name='cost_detail'
                label='Cost Detail'
              />
              <FormInput
                control={form.control}
                name='value'
                label='Value'
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
            </div>

            <div className='flex gap-4'>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Updating...' : 'Update'}
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
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <ReadonlyField label='Vendor' value={initialData.vendor} />
              <ReadonlyField
                label='Factory Name'
                value={initialData.factory_name}
              />
              <ReadonlyField
                label='Origin Country'
                value={initialData.origin_country}
              />
              <ReadonlyField
                label='Destination Country'
                value={initialData.destination_country}
              />
              <ReadonlyField
                label='Destination Warehouse'
                value={initialData.destination_warehouse}
              />
              <ReadonlyField
                label='Container Type'
                value={initialData.container_type}
              />
              <ReadonlyField
                label='Cost Detail'
                value={initialData.cost_detail}
              />
              <ReadonlyField label='Value' value={initialData.value} />
              <ReadonlyField
                label='Cost Group'
                value={initialData.cost_group}
              />
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
  value: string | number | null;
}) {
  return (
    <div>
      <label className='mb-2 block text-sm font-medium'>{label}</label>
      <div className='bg-muted/50 rounded-md border px-3 py-2 text-sm'>
        {value ?? ''}
      </div>
    </div>
  );
}
