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

import { addPortCost } from '../actions/add-port-cost';
import { addPortCostSchema } from '../actions/add-port-cost-schema';

const createPortCostSchema = addPortCostSchema.omit({
  id: true
});
type CreatePortCostSchema = z.infer<typeof createPortCostSchema>;

export default function PortCostNewForm() {
  const form = useZodForm({
    schema: createPortCostSchema,
    mode: 'all',
    defaultValues: {
      logistic_cost: '',
      start_date: '',
      end_date: '2100-01-01T00:00:00Z',
      value: 0,
      cost_group: '',
      user: ''
    }
  });

  const router = useRouter();
  const canSubmit = !form.formState.isSubmitting && form.formState.isValid;

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreatePortCostSchema) => {
      return resolveActionResult(addPortCost(data));
    },
    onSuccess: (data) => {
      toast.success(data.message);
      router.push('/dashboard/parameters/port_cost');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const onSubmit: SubmitHandler<CreatePortCostSchema> = async (data) => {
    if (!canSubmit) return;
    mutate(data);
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          Create New Port Cost Parameter
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
              name='logistic_cost'
              label='Logistic Cost'
              placeholder='Enter logistic cost'
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
            {isPending ? 'Saving Port Cost...' : 'Save Port Cost'}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
