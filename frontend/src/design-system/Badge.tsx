import { HTMLAttributes } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
type BadgeSize    = 'sm' | 'md';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?:    BadgeSize;
  dot?:     boolean;
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  neutral: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  primary: 'bg-primary-50  text-primary-700 border-primary-200',
  success: 'bg-success-50  text-success-700 border-success-200',
  warning: 'bg-warning-50  text-warning-700 border-warning-200',
  error:   'bg-error-50    text-error-700   border-error-200',
  info:    'bg-accent-50   text-accent-700  border-accent-200',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-neutral-400',
  neutral: 'bg-neutral-400',
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error:   'bg-error-500',
  info:    'bg-accent-500',
};

const sizes: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-1 gap-1.5',
};

export function Badge({ variant = 'default', size = 'sm', dot, children, className = '', ...props }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center font-medium rounded-full border',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      {...props}
    >
      {dot && (
        <span className={['w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant]].join(' ')} />
      )}
      {children}
    </span>
  );
}

/* Priority badge helper */
export const priorityVariant: Record<string, BadgeVariant> = {
  LOW:    'success',
  MEDIUM: 'warning',
  HIGH:   'error',
  URGENT: 'error',
};

/* Status badge helper */
export const statusVariant: Record<string, BadgeVariant> = {
  TODO:        'neutral',
  IN_PROGRESS: 'info',
  IN_REVIEW:   'warning',
  DONE:        'success',
  CANCELLED:   'default',
};
