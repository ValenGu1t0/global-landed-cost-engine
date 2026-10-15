'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { FormFileUpload } from '@/components/forms/form-file-upload';
import { resolveActionResult } from '@/lib/actions/client';
import { useZodForm } from '@/hooks/use-zod-form';
import { EXCEL_MIME_TYPES } from '@/mime_types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

import {
  bulkUpdateHemicodeSchema,
  type BulkUpdateHemicodeSchema
} from '@/features/products_view/actions/bulk-update-hemicode-schema';
import { bulkUpdateHemicodes } from '@/features/products_view/actions/bulk-update-hemicodes';
import PageContainer from '@/components/layout/page-container';

export default function HemicodesBulkUpdateSection() {
  // Estado para los errores masivos
  const [errorList, setErrorList] = useState<string[] | null>(null);

  const form = useZodForm({
    schema: bulkUpdateHemicodeSchema,
    mode: 'all'
  });

  const canSubmit = !form.formState.isSubmitting && form.formState.isValid;

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: BulkUpdateHemicodeSchema) =>
      resolveActionResult(bulkUpdateHemicodes(data)),

    onSuccess: (data) => {
      if (data?.errors?.length > 0) {
        setErrorList(data.errors);
        return;
      }

      toast.success(data.message);
      form.reset();
    },

    onError: (error) => {
      toast.error(error.message);
    }
  });

  const onSubmit: SubmitHandler<BulkUpdateHemicodeSchema> = async (data) => {
    if (!canSubmit) return;
    mutate(data);
  };

  return (
    <PageContainer scrollable={true}>
      <div className='w-full space-y-8'>
        {/* HEADER */}
        <div className='flex items-center justify-between'>
          <Heading
            title='Update Product Hemicodes'
            description='Bulk Update for Products Hemicodes'
          />
        </div>

        <Separator />

        {/* FORM SECTION */}
        <div className='bg-dark rounded-xl border p-6 shadow-sm'>
          <Form
            form={form}
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-8'
          >
            <FormFileUpload
              control={form.control}
              name='excel'
              label='Excel File'
              description='Upload an Excel file (.xlsx, .xls, .csv)'
              config={{
                maxSize: 5 * 1024 * 1024,
                maxFiles: 1,
                multiple: false,
                acceptedTypes: EXCEL_MIME_TYPES
              }}
            />

            <div className='flex items-center justify-between'>
              <Button variant='link' asChild>
                <a
                  href='/templates/template_update_sku.xlsx'
                  download='template_update_sku.xlsx'
                >
                  Download template (.xlsx)
                </a>
              </Button>

              <Button type='submit' disabled={!canSubmit || isPending}>
                {isPending ? 'Updating...' : 'Update Product Hemicodes'}
              </Button>
            </div>
          </Form>
        </div>

        {/* ERROR MODAL */}
        <Dialog open={!!errorList} onOpenChange={() => setErrorList(null)}>
          <DialogContent className='max-h-[80vh] max-w-lg overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Errors found in the Excel file</DialogTitle>
              <DialogDescription>
                Please review these issues before trying again.
              </DialogDescription>
            </DialogHeader>

            <ul className='text-md ml-6 list-disc space-y-1 font-medium text-red-600'>
              {errorList?.map((err, i) => <li key={i}>{err}</li>)}
            </ul>

            <DialogFooter>
              <Button onClick={() => setErrorList(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
}
