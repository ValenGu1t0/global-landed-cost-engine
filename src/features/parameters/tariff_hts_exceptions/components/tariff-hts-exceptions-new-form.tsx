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
import { z } from 'zod';

import { addTariffHTSException } from '../actions/add-tariff-hts-exception-cost';
import { addTariffHTSExceptionSchema } from '../actions/add-tariff-hts-exception-schema';

const createTariffHTSExceptionSchema = addTariffHTSExceptionSchema.omit({
  id: true
});

type CreateTariffHTSExceptionSchema = z.infer<
  typeof createTariffHTSExceptionSchema
>;

export default function TariffHTSExceptionsNewForm() {
  const form = useZodForm({
    schema: createTariffHTSExceptionSchema,
    mode: 'all',
    defaultValues: {
      hts_code: '',
      origin_country: '',
      destination_country: '',
      special_tariff_value: 0,
      cost_group: '',
      user: ''
    }
  });

  const router = useRouter();
  const canSubmit = !form.formState.isSubmitting && form.formState.isValid;

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateTariffHTSExceptionSchema) => {
      return resolveActionResult(addTariffHTSException(data));
    },
    onSuccess: (data) => {
      toast.success(data.message);
      router.push('/dashboard/parameters/tariff_hts_exceptions');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const onSubmit: SubmitHandler<CreateTariffHTSExceptionSchema> = async (
    data
  ) => {
    if (!canSubmit) return;
    mutate(data);
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          Create New HTS Exception
        </CardTitle>
      </CardHeader>

      <CardContent>
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
            />

            <FormInput
              control={form.control}
              name='origin_country'
              label='Origin Country'
              placeholder='Enter origin country'
            />

            <FormInput
              control={form.control}
              name='destination_country'
              label='Destination Country'
              placeholder='Enter destination country'
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
              placeholder='Enter cost group'
            />
          </div>

          <Button type='submit' disabled={isPending}>
            {isPending ? 'Saving HTS Exception...' : 'Save HTS Exception'}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
