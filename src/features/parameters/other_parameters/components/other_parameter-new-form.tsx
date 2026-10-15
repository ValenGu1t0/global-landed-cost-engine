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
  addOtherParameterSchema,
  AddOtherParameterSchema
} from '../actions/add-other_parameter-schema';
import { addOtherParameter } from '../actions/add-other_parameter';

export default function OtherParameterNewForm() {
  const form = useZodForm({
    schema: addOtherParameterSchema,
    mode: 'all',
    defaultValues: {
      parameter: '',
      value: 0,
      cost_group: ''
    }
  });

  const canSubmit = !form.formState.isSubmitting && form.formState.isValid;
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: AddOtherParameterSchema) =>
      resolveActionResult(addOtherParameter(data)),
    onSuccess: (data) => {
      toast.success(data.message);
      router.push('/dashboard/parameters/other_parameters');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const onSubmit: SubmitHandler<AddOtherParameterSchema> = async (data) => {
    if (!canSubmit) return;
    mutate(data);
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          Create New Other Parameter
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
              name='parameter'
              label='Parameter'
              placeholder='Enter parameter'
              required
            />

            <FormInput
              control={form.control}
              name='value'
              label='Value'
              type='number'
              step='0.01'
              placeholder='Enter value'
              required
            />

            <FormInput
              control={form.control}
              name='cost_group'
              label='Cost Group'
              placeholder='Enter cost group'
              required
            />
          </div>

          <Button type='submit' disabled={isPending}>
            {isPending ? 'Adding Parameter...' : 'Add Parameter'}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
