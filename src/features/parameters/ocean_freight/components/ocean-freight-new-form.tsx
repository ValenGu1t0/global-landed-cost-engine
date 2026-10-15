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

import { addOceanFreight } from '../actions/add-ocean-freight';
import { addOceanFreightSchema } from '../actions/add-ocean-freight-schema';

const createOceanFreightSchema = addOceanFreightSchema.omit({
  id: true
});
type CreateOceanFreightSchema = z.infer<typeof createOceanFreightSchema>;

export default function OceanFreightNewForm() {
  const form = useZodForm({
    schema: createOceanFreightSchema,
    mode: 'all',
    defaultValues: {
      origin_port: '',
      origin_country: '',
      destination_port: '',
      destination_country: '',
      container_type: '',
      value: 0,
      cost_group: ''
    }
  });

  const canSubmit = !form.formState.isSubmitting && form.formState.isValid;
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateOceanFreightSchema) => {
      return resolveActionResult(addOceanFreight(data));
    },
    onSuccess: (data) => {
      toast.success(data.message);
      router.push('/dashboard/parameters/ocean_freight');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const onSubmit: SubmitHandler<CreateOceanFreightSchema> = async (data) => {
    if (!canSubmit) return;
    mutate(data);
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          Create New Ocean Freight Parameter
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
              name='origin_port'
              label='Origin Port'
              placeholder='Enter origin port'
            />
            <FormInput
              control={form.control}
              name='origin_country'
              label='Origin Country'
              placeholder='Enter origin country'
            />
            <FormInput
              control={form.control}
              name='destination_port'
              label='Destination Port'
              placeholder='Enter destination port'
            />
            <FormInput
              control={form.control}
              name='destination_country'
              label='Destination Country'
              placeholder='Enter destination country'
            />
            <FormInput
              control={form.control}
              name='container_type'
              label='Container Type'
              placeholder='20DV / 40DV / 40HC ...'
            />

            <FormInput
              control={form.control}
              name='value'
              label='Value'
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
            {isPending ? 'Saving Ocean Freight...' : 'Save Ocean Freight'}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
