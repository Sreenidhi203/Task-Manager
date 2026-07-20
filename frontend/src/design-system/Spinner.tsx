import { HTMLAttributes } from 'react';

/* ─── Spinner ───────────────────────────────────────────────────────────────── */
type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';

interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
}

const spinnerSizes: Record<SpinnerSize, string> = {
  xs: 'w-3 h-3 border',
  sm: 'w-4 h-4 border-2',
  md: 'w-5 h-5 border-2',
  lg: 'w-7 h-7 border-2',
};

export function Spinner({ size = 'md', className = '', ...props }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={[
        'inline-block rounded-full border-current border-r-transparent animate-spin',
        spinnerSizes[size],
        className,
      ].join(' ')}
      {...props}
    />
  );
}

/* ─── Page loader ───────────────────────────────────────────────────────────── */
export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 animate-fade-in">
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-2 border-primary-100" />
        <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-primary-600 border-r-transparent animate-spin" />
      </div>
      <p className="text-sm text-neutral-400 font-medium">Loading…</p>
    </div>
  );
}

/* ─── Skeleton ──────────────────────────────────────────────────────────────── */
interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?:  string;
  height?: string;
  circle?: boolean;
}

export function Skeleton({ width, height = '16px', circle, className = '', style, ...props }: SkeletonProps) {
  return (
    <div
      className={['skeleton', circle ? 'rounded-full' : 'rounded-md', className].join(' ')}
      style={{ width, height, ...style }}
      aria-hidden="true"
      {...props}
    />
  );
}

/* ─── Skeleton presets ──────────────────────────────────────────────────────── */
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? '60%' : '100%'} height="14px" />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="surface p-5 space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <Skeleton circle width="36px" height="36px" />
        <div className="flex-1 space-y-2">
          <Skeleton width="40%" height="14px" />
          <Skeleton width="60%" height="12px" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="surface overflow-hidden">
      <div className="border-b border-neutral-200 px-4 py-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} width={`${100 / cols}%`} height="12px" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b border-neutral-100 last:border-0 px-4 py-3 flex gap-4 items-center">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} width={j === 0 ? '30%' : `${100 / cols}%`} height="14px" />
          ))}
        </div>
      ))}
    </div>
  );
}
