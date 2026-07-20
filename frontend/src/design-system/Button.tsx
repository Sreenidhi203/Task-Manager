import { forwardRef, ButtonHTMLAttributes } from 'react';
import { Spinner } from './Spinner';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
type Size    = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant;
  size?:     Size;
  loading?:  boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-md border ' +
  'transition-all duration-150 ease-smooth select-none press-effect ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary:
    'bg-primary-600 text-white border-primary-600 hover:bg-primary-700 hover:border-primary-700 ' +
    'active:bg-primary-800 shadow-sm hover:shadow-primary-md focus-visible:ring-primary-500',
  secondary:
    'bg-neutral-100 text-neutral-800 border-neutral-200 hover:bg-neutral-200 hover:border-neutral-300 ' +
    'active:bg-neutral-300 shadow-xs focus-visible:ring-neutral-400',
  ghost:
    'bg-transparent text-neutral-600 border-transparent hover:bg-neutral-100 hover:text-neutral-900 ' +
    'active:bg-neutral-200 focus-visible:ring-neutral-400',
  outline:
    'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400 ' +
    'active:bg-neutral-100 shadow-xs focus-visible:ring-neutral-400',
  danger:
    'bg-error-600 text-white border-error-600 hover:bg-error-700 hover:border-error-700 ' +
    'active:bg-error-800 shadow-sm focus-visible:ring-error-500',
  success:
    'bg-success-600 text-white border-success-600 hover:bg-success-700 hover:border-success-700 ' +
    'active:bg-success-800 shadow-sm focus-visible:ring-success-500',
};

const sizes: Record<Size, string> = {
  xs: 'h-7  px-2.5 text-xs  gap-1',
  sm: 'h-8  px-3   text-sm  gap-1.5',
  md: 'h-9  px-4   text-sm  gap-2',
  lg: 'h-11 px-5   text-base gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, iconLeft, iconRight, fullWidth, children, className = '', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[base, variants[variant], sizes[size], fullWidth ? 'w-full' : '', className].join(' ')}
        {...props}
      >
        {loading ? (
          <Spinner size="sm" className="text-current opacity-70" />
        ) : (
          iconLeft && <span className="shrink-0 w-4 h-4 flex items-center justify-center">{iconLeft}</span>
        )}
        {children && <span>{children}</span>}
        {!loading && iconRight && (
          <span className="shrink-0 w-4 h-4 flex items-center justify-center">{iconRight}</span>
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

/* Icon-only button */
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?:    Size;
  label:    string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'ghost', size = 'md', label, children, className = '', ...props }, ref) => {
    const iconSizes: Record<Size, string> = {
      xs: 'h-7 w-7',
      sm: 'h-8 w-8',
      md: 'h-9 w-9',
      lg: 'h-11 w-11',
    };
    return (
      <button
        ref={ref}
        aria-label={label}
        title={label}
        className={[base, variants[variant], iconSizes[size], 'p-0', className].join(' ')}
        {...props}
      >
        <span className="w-4 h-4 flex items-center justify-center">{children}</span>
      </button>
    );
  }
);
IconButton.displayName = 'IconButton';
