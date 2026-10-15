'use client';

import NiceModal, { type NiceModalHocProps } from '@ebay/nice-modal-react';
import { useMutation } from '@tanstack/react-query';
import { Form } from '@/components/ui/form';
import { FormFileUpload } from '@/components/forms/form-file-upload';
import { useZodForm } from '@/hooks/use-zod-form';
import { useEnhancedModal } from '@/hooks/use-enhanced-modal';
import { resolveActionResult } from '@/lib/actions/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SubmitHandler } from 'react-hook-form';
import { EXCEL_MIME_TYPES } from '@/mime_types';

import {
  bulkAddActiveProductsSchema,
  type BulkAddActiveProductsSchema
} from '../actions/bulk-add-active-products-schema';
import { bulkAddActiveProducts } from '../actions/bulk-add-active-products';
import { useState } from 'react';

export type ProductsViewBulkAddModalProps = NiceModalHocProps;

export const ProductsActiveBulkAddModal =
  NiceModal.create<ProductsViewBulkAddModalProps>(() => {
    const modal = useEnhancedModal();

    // Estado para los errores de la carga masiva
    const [errorList, setErrorList] = useState<string[] | null>(null);

    const form = useZodForm({
      schema: bulkAddActiveProductsSchema,
      mode: 'all'
    });

    const canSubmit = !form.formState.isSubmitting && form.formState.isValid;
    const title = 'Bulk Add Active Products';
    const description = 'Upload an Excel file to add multiple products.';

    const { mutate, isPending } = useMutation({
      mutationFn: async (data: BulkAddActiveProductsSchema) => {
        return resolveActionResult(bulkAddActiveProducts(data));
      },
      onSuccess: (data) => {
        // Si tiene al menos un error invocamos el modal
        if (data?.errors?.length > 0) {
          setErrorList(data.errors);
          return;
        }

        toast.success(data.message);
        modal.handleClose();
        form.reset();
      },
      onError: (error) => {
        toast.error(error.message);
      }
    });

    const onSubmit: SubmitHandler<BulkAddActiveProductsSchema> = async (
      data
    ) => {
      if (!canSubmit) return;
      mutate(data);
    };

    return (
      <>
        {/* Modal principal */}
        <Dialog open={modal.visible} onOpenChange={modal.handleClose}>
          <DialogContent className='max-w-md'>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>

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
                  maxSize: 5 * 1024 * 1024, // 5MB
                  maxFiles: 1,
                  multiple: false,
                  acceptedTypes: EXCEL_MIME_TYPES
                }}
              />

              <DialogFooter>
                <div className='flex w-full flex-row items-center justify-between'>
                  <Button variant='link' asChild>
                    <a
                      href='/templates/template_bulk_add_products.xlsx'
                      download='template_bulk_add_products.xlsx'
                    >
                      Download template (.xlsx)
                    </a>
                  </Button>

                  <div className='space-x-2'>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={modal.handleClose}
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                    <Button type='submit' disabled={!canSubmit || isPending}>
                      {isPending ? 'Adding...' : 'Add Active Products'}
                    </Button>
                  </div>
                </div>
              </DialogFooter>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Modal para errores */}
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
      </>
    );
  });
