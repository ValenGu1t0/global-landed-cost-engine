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
  addDutiesCommercialAgreementSchema,
  AddDutiesCommercialAgreementSchema
} from '../actions/add-duties-commercial-agreements-schema';
import { addDutiesCommercialAgreement } from '../actions/add-duties-commercial-agreements';

export default function DutiesCommercialAgreementsNewForm() {
  const form = useZodForm({
    schema: addDutiesCommercialAgreementSchema,
    mode: 'all',
    defaultValues: {
      origin_country: '',
      destination_country: '',
      raw_material: '',
      cost_group: ''
    }
  });

  const canSubmit = !form.formState.isSubmitting && form.formState.isValid;

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: AddDutiesCommercialAgreementSchema) => {
      return resolveActionResult(addDutiesCommercialAgreement(data));
    },
    onSuccess: (data) => {
      toast.success(data.message);
      router.push('/dashboard/parameters/duties_commercial_agreements');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const onSubmit: SubmitHandler<AddDutiesCommercialAgreementSchema> = async (
    data
  ) => {
    if (!canSubmit) return;
    mutate(data);
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          Create Duty Commercial Agreement
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
              name='origin_country'
              label='Origin Country'
              placeholder='Enter origin country'
              required
            />

            <FormInput
              control={form.control}
              name='destination_country'
              label='Destination Country'
              placeholder='Enter destination country'
              required
            />

            <FormInput
              control={form.control}
              name='raw_material'
              label='Raw Material'
              placeholder='Enter raw material'
              required
            />

            <FormInput
              control={form.control}
              name='cost_group'
              label='Cost Group'
              placeholder='Enter cost group (optional)'
            />
          </div>

          <Button type='submit' disabled={isPending}>
            {isPending ? 'Creating...' : 'Create Agreement'}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
