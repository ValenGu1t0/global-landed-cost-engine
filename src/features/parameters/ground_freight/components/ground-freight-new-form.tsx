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

import { addGroundFreight } from '../actions/add-ground-freight';
import { addGroundFreightSchema } from '../actions/add-ground-freight-schema';

const createGroundFreightSchema = addGroundFreightSchema.omit({
  id: true
});
type CreateGroundFreightSchema = z.infer<typeof createGroundFreightSchema>;

export default function GroundFreightNewForm() {
  const form = useZodForm({
    schema: createGroundFreightSchema,
    mode: 'all',
    defaultValues: {
      vendor: '',
      factory_name: '',
      origin_country: '',
      destination_country: '',
      destination_warehouse: '',
      container_type: '',
      cost_detail: '',
      value: 0,
      cost_group: ''
    }
  });

  const canSubmit = !form.formState.isSubmitting && form.formState.isValid;
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateGroundFreightSchema) => {
      return resolveActionResult(addGroundFreight(data));
    },
    onSuccess: (data) => {
      toast.success(data.message);
      router.push('/dashboard/parameters/ground_freight');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const onSubmit: SubmitHandler<CreateGroundFreightSchema> = async (data) => {
    if (!canSubmit) return;
    mutate(data);
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          Create New Ground Freight Parameter
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
              name='vendor'
              label='Vendor'
              placeholder='Enter vendor'
            />
            <FormInput
              control={form.control}
              name='factory_name'
              label='Factory Name'
              placeholder='Enter factory name'
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
              name='destination_warehouse'
              label='Destination Warehouse'
              placeholder='Enter warehouse'
            />
            <FormInput
              control={form.control}
              name='container_type'
              label='Container Type'
              placeholder='20DV / 40DV / 40HC ...'
            />

            <FormInput
              control={form.control}
              name='cost_detail'
              label='Cost Detail'
              placeholder='Enter detail'
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
            {isPending ? 'Saving Ground Freight...' : 'Save Ground Freight'}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
