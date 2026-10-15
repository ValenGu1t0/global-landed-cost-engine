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
import { Controller } from 'react-hook-form';

import {
  addVendorPortSchema,
  AddVendorPortSchema
} from '../actions/add-vendor_port-schema';
import { addVendorPort } from '../actions/add-vendor_port';

export default function VendorPortNewForm() {
  const form = useZodForm({
    schema: addVendorPortSchema,
    mode: 'all',
    defaultValues: {
      vendor: '',
      country: '',
      port: '',
      main_port: false
    }
  });

  const canSubmit = !form.formState.isSubmitting && form.formState.isValid;
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: AddVendorPortSchema) => {
      return resolveActionResult(addVendorPort(data));
    },
    onSuccess: (data) => {
      toast.success(data.message);
      router.push('/dashboard/parameters/vendor_ports');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const onSubmit: SubmitHandler<AddVendorPortSchema> = async (data) => {
    if (!canSubmit) {
      return;
    }

    mutate(data);
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          Create New Vendor Port
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
              required
            />

            <FormInput
              control={form.control}
              name='country'
              label='Country'
              placeholder='Enter country'
              required
            />

            <FormInput
              control={form.control}
              name='port'
              label='Port'
              placeholder='Enter port'
              required
            />

            <Controller
              control={form.control}
              name='main_port'
              render={({ field }) => (
                <div className='mt-6 flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                  <label className='font-medium'>Main Port</label>
                </div>
              )}
            />
          </div>
          <Button type='submit' disabled={isPending}>
            {isPending ? 'Adding Vendor Port...' : 'Add Vendor Port'}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
