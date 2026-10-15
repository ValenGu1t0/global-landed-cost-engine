'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  recalculateLandedCostsAction,
  RecalculateResult
} from '../actions/recalculate-landed-costs';
import {
  IconBolt,
  IconLoader2,
  IconTerminal2,
  IconBoxSeam
} from '@tabler/icons-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface LandedCostEngineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LandedCostEngineModal({
  open,
  onOpenChange
}: LandedCostEngineModalProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<RecalculateResult | null>(null);
  const router = useRouter();

  const handleRun = async () => {
    setIsRunning(true);
    setLogs([
      '🚀 Initializing Global Landed Cost Calculation Engine...',
      'Connecting to Neon Serverless PostgreSQL instance...'
    ]);
    setResult(null);

    try {
      const res = await recalculateLandedCostsAction();
      setResult(res);
      setLogs(res.logs);

      if (res.success) {
        toast.success(
          `Engine completed: ${res.processedCount} products updated in ${res.durationMs}ms`
        );
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error('Engine calculation failed');
      setLogs((prev) => [
        ...prev,
        `❌ Fatal Error: ${err?.message || 'Unknown'}`
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[620px]'>
        <DialogHeader>
          <div className='flex items-center gap-2'>
            <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500'>
              <IconBolt className='h-5 w-5' />
            </div>
            <div>
              <DialogTitle className='text-xl'>
                Landed Cost Calculation Engine
              </DialogTitle>
              <DialogDescription className='text-xs'>
                Automated freight logistics, container loading optimization &
                tariff calculation pipeline.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Engine Pipeline Steps explanation */}
        <div className='grid grid-cols-3 gap-2 py-2 text-xs'>
          <div className='bg-muted/40 rounded-lg border p-2 text-center'>
            <div className='text-foreground font-semibold'>1. Packaging 3D</div>
            <div className='text-muted-foreground text-[11px]'>
              CBM / CFT & TI-HI Pallet Stacking
            </div>
          </div>
          <div className='bg-muted/40 rounded-lg border p-2 text-center'>
            <div className='text-foreground font-semibold'>
              2. Container Load
            </div>
            <div className='text-muted-foreground text-[11px]'>
              20STD, 40STD, 40HC, 45HC, 53FT
            </div>
          </div>
          <div className='bg-muted/40 rounded-lg border p-2 text-center'>
            <div className='text-foreground font-semibold'>3. Landed Cost</div>
            <div className='text-muted-foreground text-[11px]'>
              FOB + Freight + Duties & Tariffs
            </div>
          </div>
        </div>

        {/* Terminal Window Output */}
        <div className='rounded-lg border bg-zinc-950 p-4 font-mono text-xs text-zinc-200 shadow-inner dark:bg-black'>
          <div className='mb-2 flex items-center justify-between border-b border-zinc-800 pb-2 text-[11px] text-zinc-400'>
            <div className='flex items-center gap-1.5'>
              <IconTerminal2 className='h-3.5 w-3.5 text-emerald-400' />
              <span>engine_pipeline.log</span>
            </div>
            {result?.durationMs ? (
              <span className='rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-400'>
                {result.durationMs}ms
              </span>
            ) : null}
          </div>

          <div className='h-48 space-y-1.5 overflow-y-auto pr-1 text-[11px] leading-relaxed'>
            {logs.length === 0 ? (
              <div className='flex h-full flex-col items-center justify-center text-zinc-500'>
                <IconBoxSeam className='mb-2 h-7 w-7 opacity-40' />
                <p>
                  Engine idle. Click below to execute pipeline across all
                  products.
                </p>
              </div>
            ) : (
              logs.map((log, idx) => (
                <div
                  key={idx}
                  className={
                    log.startsWith('✓')
                      ? 'font-semibold text-emerald-400'
                      : log.startsWith('❌')
                        ? 'font-semibold text-red-400'
                        : log.startsWith('🚀')
                          ? 'text-amber-300'
                          : 'text-zinc-300'
                  }
                >
                  {log}
                </div>
              ))
            )}
            {isRunning && (
              <div className='flex items-center gap-2 text-amber-400'>
                <IconLoader2 className='h-3.5 w-3.5 animate-spin' />
                <span>Computing optimal container economics...</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className='flex items-center justify-between sm:justify-between'>
          <div className='text-muted-foreground text-[11px]'>
            {result?.processedCount !== undefined ? (
              <span>✓ Processed {result.processedCount} products</span>
            ) : (
              <span>Deterministic on-the-fly execution</span>
            )}
          </div>

          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onOpenChange(false)}
              disabled={isRunning}
            >
              Close
            </Button>
            <Button
              size='sm'
              onClick={handleRun}
              disabled={isRunning}
              className='gap-2 bg-amber-600 text-white hover:bg-amber-700'
            >
              {isRunning ? (
                <>
                  <IconLoader2 className='h-4 w-4 animate-spin' />{' '}
                  Calculating...
                </>
              ) : (
                <>
                  <IconBolt className='h-4 w-4' /> Run Calculation Engine
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
