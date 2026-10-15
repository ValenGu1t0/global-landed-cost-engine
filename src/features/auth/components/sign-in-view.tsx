import { SignIn as ClerkSignInForm } from '@clerk/nextjs';
import Link from 'next/link';
import { Calculator, Globe2, Layers, ShieldCheck, Ship } from 'lucide-react';

export default function SignInViewPage() {
  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      {/* Left Panel: Enterprise Branding */}
      <div className='relative hidden h-full flex-col justify-between p-10 text-white lg:flex'>
        {/* Background gradient */}
        <div
          className='absolute inset-0'
          style={{
            background:
              'linear-gradient(135deg, #064E3B 0%, #0F172A 70%, #022C22 100%)'
          }}
        />

        {/* Top Header */}
        <div className='relative z-20 flex items-center gap-2.5 text-base font-bold tracking-tight'>
          <div className='flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/20 text-emerald-400'>
            <Calculator className='h-5 w-5' />
          </div>
          <span>Global Landed Cost Engine</span>
        </div>

        {/* Center Hero */}
        <div className='relative z-20 my-auto max-w-lg space-y-6'>
          <div className='inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300'>
            <Globe2 className='h-3.5 w-3.5' /> Enterprise Global Trade
            Intelligence
          </div>

          <h1 className='text-3xl font-extrabold tracking-tight sm:text-4xl'>
            Deterministic Landed Cost & Freight Optimization.
          </h1>

          <p className='text-sm leading-relaxed text-slate-300'>
            Replace fragmented multi-sheet spreadsheets with an automated trade
            engine. Compute cross-border tariffs, 3D container packing yields
            (40HC, 45HC, 53FT), and landed margins on the fly.
          </p>

          <div className='grid grid-cols-2 gap-3 pt-2 text-xs text-slate-200'>
            <div className='flex items-center gap-2 rounded-md border border-white/10 bg-white/5 p-2.5 backdrop-blur-sm'>
              <Ship className='h-4 w-4 text-emerald-400' />
              <span>Multi-Modal 3D Load Matrix</span>
            </div>
            <div className='flex items-center gap-2 rounded-md border border-white/10 bg-white/5 p-2.5 backdrop-blur-sm'>
              <ShieldCheck className='h-4 w-4 text-emerald-400' />
              <span>HTS & Section 301 Tariffs</span>
            </div>
            <div className='flex items-center gap-2 rounded-md border border-white/10 bg-white/5 p-2.5 backdrop-blur-sm'>
              <Layers className='h-4 w-4 text-emerald-400' />
              <span>Sub-Second Server Actions</span>
            </div>
            <div className='flex items-center gap-2 rounded-md border border-white/10 bg-white/5 p-2.5 backdrop-blur-sm'>
              <Calculator className='h-4 w-4 text-emerald-400' />
              <span>Zero Spreadsheets Needed</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='relative z-20 text-xs text-slate-400'>
          Developed for modern supply chains and international logistics teams.
        </div>
      </div>

      {/* Right Panel: Clerk Authentication Form */}
      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          {/* Mobile Header */}
          <div className='flex flex-col items-center text-center lg:hidden'>
            <div className='mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg'>
              <Calculator className='h-6 w-6' />
            </div>
            <h2 className='text-xl font-bold'>Global Landed Cost Engine</h2>
            <p className='text-muted-foreground text-xs'>
              Sign in to access your logistics portfolio demo
            </p>
          </div>

          <ClerkSignInForm />

          <p className='text-muted-foreground px-8 text-center text-xs'>
            Portfolio showcase application developed by{' '}
            <span className='text-foreground font-semibold'>
              Valentino Privitera
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
