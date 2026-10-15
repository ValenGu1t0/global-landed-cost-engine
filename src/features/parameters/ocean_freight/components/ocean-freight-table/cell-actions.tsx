'use client';

import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { IconEdit, IconDotsVertical } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { OceanFreight } from '@/db/schema';

interface CellActionProps {
  data: OceanFreight;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const today = new Date().toISOString().slice(0, 10);
  const isStartDateToday = data.start_date?.slice(0, 10) === today;
  const isEndDate2100 = data.end_date?.startsWith('2100');
  const isEditable = isStartDateToday && isEndDate2100;

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return 'Deleted!';
    },
    onSuccess: () => {
      setOpen(false);
    },
    onError: (error) => {
      toast.error(`Couldn't delete the Ocean Freight: ${error}`);
    }
  });

  const onConfirm = async () => {
    mutate();
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={isPending}
      />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <IconDotsVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          {isEditable && (
            <DropdownMenuItem
              onClick={() =>
                router.push(`/dashboard/parameters/ocean_freight/${data.id}`)
              }
            >
              <IconEdit className='mr-2 h-4 w-4' /> Update
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
