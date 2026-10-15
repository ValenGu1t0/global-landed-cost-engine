'use client';

import { FormInput } from '@/components/forms/form-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { resolveActionResult } from '@/lib/actions/client';
import { useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useZodForm } from '@/hooks/use-zod-form';
import { z } from 'zod';

import { addTariffParameters } from '../actions/add-tariff-parameter';
import { addTariffParametersSchema } from '../actions/add-tariff-parameter-schema';
import { Checkbox } from '@/components/ui/checkbox';

const createTariffParametersSchema = addTariffParametersSchema.omit({
  id: true
});
type CreateTariffParametersSchema = z.infer<
  typeof createTariffParametersSchema
>;

export default function TariffParametersNewForm() {
  const form = useZodForm({
    schema: createTariffParametersSchema,
    mode: 'all',
    defaultValues: {
      origin_country: '',
      destination_country: '',
      value: 0,
      cost_group: '',
      duty_dependent: false
    }
  });

  const router = useRouter();
  const canSubmit = !form.formState.isSubmitting && form.formState.isValid;

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateTariffParametersSchema) => {
      return resolveActionResult(addTariffParameters(data));
    },
    onSuccess: (data) => {
      toast.success(data.message);
      router.push('/dashboard/parameters/tariff_parameters');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const onSubmit: SubmitHandler<CreateTariffParametersSchema> = async (
    data
  ) => {
    if (!canSubmit) return;
    mutate(data);
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          Create New Tariff Parameter
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
            />

            <FormInput
              control={form.control}
              name='destination_country'
              label='Destination Country'
              placeholder='Enter destination country'
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

            <FormField
              control={form.control}
              name='duty_dependent'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-y-0 space-x-3'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Duty Dependent</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type='submit' disabled={isPending}>
            {isPending ? 'Saving Tariff Parameter...' : 'Save Tariff Parameter'}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
