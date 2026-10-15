import * as z from 'zod';
import { EXCEL_MIME_TYPES } from '@/mime_types';

const MAX_FILE_SIZE = 5000000;

const isValidExcelFile = (file: File): boolean => {
  return EXCEL_MIME_TYPES.includes(file.type);
};

export const bulkAddProductsSchema = z.object({
  excel: z
    .any()
    .optional()
    .refine((files) => !files || files?.length == 1, 'Excel file is required.')
    .refine(
      (files) => !files || files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => !files || isValidExcelFile(files?.[0]),
      '.xlsx, .xls and .csv files are accepted.'
    )
});

export type BulkAddProductsSchema = z.infer<typeof bulkAddProductsSchema>;
