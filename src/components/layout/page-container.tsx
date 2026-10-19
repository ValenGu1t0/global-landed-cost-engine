import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PageContainer({
  children,
  scrollable = true
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className='h-[calc(100svh-4rem)] w-full min-w-0'>
          <div className='flex min-w-0 flex-1 p-4 md:px-6'>{children}</div>
        </ScrollArea>
      ) : (
        <div className='flex h-[calc(100svh-4rem)] max-h-[calc(100svh-4rem)] min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-4 md:px-6'>
          {children}
        </div>
      )}
    </>
  );
}
