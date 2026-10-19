'use client';

import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { Icons } from '@/components/icons';

export default function ParametersPage() {
  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <Heading
            title='Products Statuses'
            description='Manage bulk products statuses'
          />
        </div>

        <Separator />

        {/* Grid de Cards */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {/* Card: Activate */}
          <Card className='group cursor-pointer transition-shadow duration-300 hover:shadow-lg'>
            <CardHeader className='flex flex-row items-center gap-4'>
              <div className='bg-muted group-hover:bg-primary/10 rounded-full p-3 transition-colors'>
                <Icons.check className='text-muted-foreground group-hover:text-primary h-6 w-6' />
              </div>
              <div>
                <CardTitle className='text-lg font-semibold'>
                  Activate Products
                </CardTitle>
                <CardDescription>Go to activate products</CardDescription>
              </div>
            </CardHeader>

            <CardFooter>
              <Link
                href='/dashboard/edit/status/activate'
                className='text-primary text-sm hover:underline'
              >
                Go to Activate
              </Link>
            </CardFooter>
          </Card>

          {/* Card: Deactivate */}
          <Card className='group cursor-pointer transition-shadow duration-300 hover:shadow-lg'>
            <CardHeader className='flex flex-row items-center gap-4'>
              <div className='bg-muted group-hover:bg-primary/10 rounded-full p-3 transition-colors'>
                <Icons.trash className='text-muted-foreground group-hover:text-primary h-6 w-6' />
              </div>
              <div>
                <CardTitle className='text-lg font-semibold'>
                  Deactivate Products
                </CardTitle>
                <CardDescription>Go to deactivate products</CardDescription>
              </div>
            </CardHeader>

            <CardFooter>
              <Link
                href='/dashboard/edit/status/deactivate'
                className='text-primary text-sm hover:underline'
              >
                Go to Deactivate
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
