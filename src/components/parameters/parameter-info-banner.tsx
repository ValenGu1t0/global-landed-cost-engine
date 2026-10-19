'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Info,
  ChevronDown,
  ChevronUp,
  Calculator,
  Layers,
  History,
  BookOpen
} from 'lucide-react';

export interface ParameterInfoBannerProps {
  title: string;
  parameterKey: string;
  cardinality: 'multiple' | 'single_deprecating';
  purpose: string;
  validityRules: string;
  calculationImpact: string;
  formula?: string;
  example?: string;
}

export function ParameterInfoBanner({
  title,
  parameterKey,
  cardinality,
  purpose,
  validityRules,
  calculationImpact,
  formula,
  example
}: ParameterInfoBannerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isSingle = cardinality === 'single_deprecating';

  return (
    <Card className='border-primary/20 bg-muted/30 mb-2 overflow-hidden shadow-sm transition-all'>
      <div className='flex flex-wrap items-center justify-between gap-3 p-4'>
        <div className='flex items-center gap-3'>
          <div className='bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg'>
            <BookOpen className='h-5 w-5' />
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <h3 className='text-sm font-semibold tracking-tight'>{title}</h3>
              <Badge
                variant={isSingle ? 'warning' : 'default'}
                className='text-[11px] font-medium'
              >
                {isSingle ? (
                  <span className='flex items-center gap-1'>
                    <History className='h-3 w-3' /> Single Active (Deprecates
                    Previous)
                  </span>
                ) : (
                  <span className='flex items-center gap-1'>
                    <Layers className='h-3 w-3' /> Multiple Active (N Allowed)
                  </span>
                )}
              </Badge>
            </div>
            <p className='text-muted-foreground line-clamp-1 text-xs'>
              {purpose}
            </p>
          </div>
        </div>

        <Button
          variant='ghost'
          size='sm'
          onClick={() => setIsOpen(!isOpen)}
          className='text-muted-foreground hover:text-foreground text-xs'
        >
          {isOpen ? 'Hide Engine Specs' : 'View Business Logic & Formulas'}
          {isOpen ? (
            <ChevronUp className='ml-1.5 h-3.5 w-3.5' />
          ) : (
            <ChevronDown className='ml-1.5 h-3.5 w-3.5' />
          )}
        </Button>
      </div>

      {isOpen && (
        <CardContent className='border-border/60 bg-background/50 border-t p-4 pt-4 text-xs leading-relaxed'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            {/* Column 1: Trade Purpose */}
            <div className='space-y-1.5'>
              <div className='text-primary flex items-center gap-1.5 font-semibold'>
                <Info className='h-3.5 w-3.5' />
                <span>Trade Purpose & Scope</span>
              </div>
              <p className='text-muted-foreground'>{purpose}</p>
            </div>

            {/* Column 2: Lifecycle & Validity */}
            <div className='space-y-1.5'>
              <div className='text-primary flex items-center gap-1.5 font-semibold'>
                <Layers className='h-3.5 w-3.5' />
                <span>Lifecycle & Deprecation Rule</span>
              </div>
              <p className='text-muted-foreground'>{validityRules}</p>
            </div>

            {/* Column 3: Impact on Calculation */}
            <div className='space-y-1.5'>
              <div className='text-primary flex items-center gap-1.5 font-semibold'>
                <Calculator className='h-3.5 w-3.5' />
                <span>Landed Cost Engine Impact</span>
              </div>
              <p className='text-muted-foreground'>{calculationImpact}</p>
            </div>
          </div>

          {(formula || example) && (
            <div className='border-border/50 bg-muted/60 mt-4 rounded-md border p-3'>
              {formula && (
                <div className='flex flex-wrap items-center gap-2'>
                  <span className='font-semibold text-slate-700 dark:text-slate-300'>
                    Mathematical Formula:
                  </span>
                  <code className='rounded bg-slate-900/10 px-2 py-0.5 font-mono text-[11px] text-emerald-700 dark:bg-slate-900/40 dark:text-emerald-400'>
                    {formula}
                  </code>
                </div>
              )}
              {example && (
                <p className='text-muted-foreground mt-1 text-[11px] italic'>
                  Example: {example}
                </p>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
