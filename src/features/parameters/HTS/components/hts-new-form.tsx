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

import {
  addHTSCodeSchema,
  AddHTSCodeSchema
} from '../actions/add-hts-code-schema';
import { addHTSCode } from '../actions/add-hts-code';

export default function HTSNewForm() {
  const form = useZodForm({
    schema: addHTSCodeSchema,
    mode: 'all',
    defaultValues: {
      hts_code: '',
      hts_category: '',
      min_value: 0,
      max_value: 0,
      type: '',
      duty: 0,
      cost_group: '',
      hts_product_subtype: '',
      fixed_duty_per_piece: 0,
      notes: ''
    }
  });

  const canSubmit = !form.formState.isSubmitting && form.formState.isValid;
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: AddHTSCodeSchema) => {
      return resolveActionResult(addHTSCode(data));
    },
    onSuccess: (data) => {
      toast.success(data.message);
      router.push('/dashboard/parameters/HTS');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const onSubmit: SubmitHandler<AddHTSCodeSchema> = async (data) => {
    if (!canSubmit) {
      return;
    }

    mutate(data);
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          Create New HTS Code
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
              required
            />
            <FormInput
              control={form.control}
              name='hts_category'
              label='Category'
              placeholder='Enter category'
            />
            <FormInput
              control={form.control}
              name='min_value'
              label='Min Value'
              type='number'
              step='0.01'
            />
            <FormInput
              control={form.control}
              name='max_value'
              label='Max Value'
              type='number'
              step='0.01'
            />
            <FormInput
              control={form.control}
              name='type'
              label='Type'
              placeholder='Enter type'
            />
            <FormInput
              control={form.control}
              name='duty'
              label='Duty'
              type='number'
              step='0.01'
            />
            <FormInput
              control={form.control}
              name='cost_group'
              label='Cost Group'
              placeholder='Enter cost group'
            />
            <FormInput
              control={form.control}
              name='hts_product_subtype'
              label='Product Subtype'
              placeholder='Enter subtype'
            />
            <FormInput
              control={form.control}
              name='fixed_duty_per_piece'
              label='Fixed Duty per Piece'
              type='number'
              step='0.01'
            />
          </div>

          <FormTextarea
            control={form.control}
            name='notes'
            label='Notes'
            placeholder='Enter notes (optional)'
            config={{
              maxLength: 500,
              showCharCount: true,
              rows: 4
            }}
          />

          <Button type='submit' disabled={isPending}>
            {isPending ? 'Adding HTS Code...' : 'Add HTS Code'}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
