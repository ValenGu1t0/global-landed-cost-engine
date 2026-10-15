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

import {
  addIncotermCostGroupSchema,
  AddIncotermCostGroupSchema
} from '../actions/add-incoterm_cost_group-schema';
import { addIncotermCostGroup } from '../actions/add-incoterm_cost_group';

export default function IncotermCostGroupNewForm() {
  const form = useZodForm({
    schema: addIncotermCostGroupSchema,
    mode: 'all',
    defaultValues: {
      cost_group: '',
      vendor: '',
      country: '',
      incoterm: ''
    }
  });

  const canSubmit = !form.formState.isSubmitting && form.formState.isValid;
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: AddIncotermCostGroupSchema) =>
      resolveActionResult(addIncotermCostGroup(data)),
    onSuccess: (data) => {
      toast.success(data.message);
      router.push('/dashboard/parameters/incoterm_cost_group');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const onSubmit: SubmitHandler<AddIncotermCostGroupSchema> = async (data) => {
    if (!canSubmit) return;
    mutate(data);
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          Create New Incoterm Cost Group
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
              name='cost_group'
              label='Cost Group'
              placeholder='Enter Cost Group'
              required
            />

            <FormInput
              control={form.control}
              name='vendor'
              label='Vendor'
              placeholder='Enter Vendor'
              required
            />

            <FormInput
              control={form.control}
              name='country'
              label='Country'
              placeholder='Enter Country'
              required
            />

            <FormInput
              control={form.control}
              name='incoterm'
              label='Incoterm'
              placeholder='Enter Incoterm'
              required
            />
          </div>

          <Button type='submit' disabled={isPending}>
            {isPending
              ? 'Adding Incoterm Cost Group...'
              : 'Add Incoterm Cost Group'}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
