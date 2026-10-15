'use client';

import { FormInput } from '@/components/forms/form-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { DutiesCommercialAgreements } from '@/db/schema';
import { resolveActionResult } from '@/lib/actions/client';
import { useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useZodForm } from '@/hooks/use-zod-form';
import { useState, useEffect } from 'react';
import { IconEdit } from '@tabler/icons-react';
import { updateDutiesCommercialAgreement } from '../actions/update-duties-commercial-agreements';
import {
  UpdateDutiesCommercialAgreementSchema,
  updateDutiesCommercialAgreementSchema
} from '../actions/update-duties-commercial-agreements-schema';

export default function DutiesCommercialAgreementsViewForm({
  initialData,
  pageTitle
}: {
  initialData: DutiesCommercialAgreements;
  pageTitle: string;
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isRecordEditable, setIsRecordEditable] = useState(false);

  const router = useRouter();

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
    schema: updateDutiesCommercialAgreementSchema,
    mode: 'all',
    defaultValues: {
      id: initialData.id,
      origin_country: initialData.origin_country || '',
      destination_country: initialData.destination_country || '',
      raw_material: initialData.raw_material || '',
      cost_group: initialData.cost_group || ''
    }
  });

  const canSubmit = !form.formState.isSubmitting && form.formState.isValid;

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UpdateDutiesCommercialAgreementSchema) => {
      return resolveActionResult(updateDutiesCommercialAgreement(data));
    },
    onSuccess: () => {
      toast.success('Record updated successfully');
      setIsEditMode(false);
      router.refresh();
    },
    onError: (error) => {
      toast.error(`No se pudo actualizar: ${error}`);
    }
  });

  const onSubmit: SubmitHandler<UpdateDutiesCommercialAgreementSchema> = async (
    data
  ) => {
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
                name='raw_material'
                label='Raw Material'
                disabled
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
              <ReadonlyField
                label='Origin Country'
                value={initialData.origin_country}
              />

              <ReadonlyField
                label='Destination Country'
                value={initialData.destination_country}
              />

              <ReadonlyField
                label='Raw Material'
                value={initialData.raw_material}
              />

              <ReadonlyField
                label='Cost Group'
                value={initialData.cost_group ?? ''}
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
