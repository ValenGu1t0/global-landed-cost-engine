'use client';

import { FormInput } from '@/components/forms/form-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { resolveActionResult } from '@/lib/actions/client';
import { useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useZodForm } from '@/hooks/use-zod-form';
import { useEffect, useState } from 'react';
import { IconEdit } from '@tabler/icons-react';
import {
  updateTariffHTSExceptionSchema,
  UpdateTariffHTSExceptionSchema
} from '../actions/update-tariff-hts-exception-schema';
import { updateTariffHTSException } from '../actions/update-tariff-hts-exception';

export default function TariffHTSExceptionsViewForm({
  initialData,
  pageTitle
}: {
  initialData: any;
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
    schema: updateTariffHTSExceptionSchema,
    mode: 'all',
    defaultValues: {
      id: initialData.id,
      hts_code: initialData?.hts_code || '',
      origin_country: initialData?.origin_country || '',
      destination_country: initialData?.destination_country || '',
      special_tariff_value: initialData?.special_tariff_value || 0,
      cost_group: initialData?.cost_group || '',
      user: initialData?.user || ''
    }
  });

  const canSubmit = !form.formState.isSubmitting && form.formState.isValid;

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UpdateTariffHTSExceptionSchema) => {
      return resolveActionResult(updateTariffHTSException(data));
    },
    onSuccess: () => {
      toast.success('HTS Exception updated successfully');
      setIsEditMode(false);
      router.refresh();
    },
    onError: (error) => {
      toast.error(`Couldn't update HTS Exception: ${error.message}`);
    }
  });

  const onSubmit: SubmitHandler<UpdateTariffHTSExceptionSchema> = async (
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
                name='hts_code'
                label='HTS Code'
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
                name='special_tariff_value'
                label='Special Tariff Value'
                type='number'
                step='0.01'
              />
              <FormInput
                control={form.control}
                name='cost_group'
                label='Cost Group'
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
              <ReadonlyField label='HTS Code' value={initialData.hts_code} />
              <ReadonlyField
                label='Origin Country'
                value={initialData.origin_country}
              />
              <ReadonlyField
                label='Destination Country'
                value={initialData.destination_country}
              />
              <ReadonlyField
                label='Special Tariff Value'
                value={initialData.special_tariff_value}
              />
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
