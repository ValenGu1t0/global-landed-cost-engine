'use client';

import NiceModal, { type NiceModalHocProps } from '@ebay/nice-modal-react';
import { useMutation } from '@tanstack/react-query';
import { Form } from '@/components/ui/form';

import { FormFileUpload } from '@/components/forms/form-file-upload';
import { useZodForm } from '@/hooks/use-zod-form';
import {
  bulkAddProductsSchema,
  type BulkAddProductsSchema
} from '../actions/bulk-add-products-schema';
import { useEnhancedModal } from '@/hooks/use-enhanced-modal';
import { resolveActionResult } from '@/lib/actions/client';
import { bulkAddProducts } from '../actions/bulk-add-products';
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

export type ProductBulkAddModalProps = NiceModalHocProps;

export const ProductBulkAddModal = NiceModal.create<ProductBulkAddModalProps>(
  () => {
    const modal = useEnhancedModal();
    const form = useZodForm({
      schema: bulkAddProductsSchema,
      mode: 'all'
    });
    const canSubmit = !form.formState.isSubmitting && form.formState.isValid;
    const title = 'Bulk Add Products';
    const description = 'Upload an Excel file to add multiple products.';

    const { mutate, isPending } = useMutation({
      mutationFn: async (data: BulkAddProductsSchema) => {
        return resolveActionResult(bulkAddProducts(data));
      },
      onSuccess: (data) => {
        toast.success(data.message);
        modal.handleClose();
        form.reset();
      },
      onError: (error) => {
        toast.error(error.message);
      }
    });

    const onSubmit: SubmitHandler<BulkAddProductsSchema> = async (data) => {
      if (!canSubmit) {
        return;
      }

      mutate(data);
    };

    return (
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
            <DialogFooter className='gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={modal.handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={!canSubmit || isPending}>
                {isPending ? 'Adding...' : 'Add Products'}
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
);
