import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?:   boolean;
  glass?:   boolean;
}

const paddings = {
  none: '',
  sm:   'p-4',
  md:   'p-5',
  lg:   'p-6',
};

export function Card({ padding = 'md', hover, glass, children, className = '', ...props }: CardProps) {
  return (
    <div
      className={[
        glass ? 'glass' : 'surface',
        paddings[padding],
        hover ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer' : '',
        'animate-fade-up',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── Card sub-components ── */
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title:    string;
  subtitle?: string;
  action?:  ReactNode;
}

export function CardHeader({ title, subtitle, action, className = '', ...props }: CardHeaderProps) {
  return (
    <div className={['flex items-start justify-between gap-4 mb-4', className].join(' ')} {...props}>
      <div>
        <h3 className="text-base font-semibold text-neutral-900 tracking-tight">{title}</h3>
        {subtitle && <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={['flex items-center justify-between gap-3 pt-4 mt-4 border-t border-neutral-100', className].join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── Stat card ── */
interface StatCardProps {
  label:   string;
  value:   string | number;
  delta?:  { value: string; positive: boolean };
  icon?:   ReactNode;
  color?:  'primary' | 'success' | 'warning' | 'error' | 'neutral';
}

const iconColors = {
  primary: 'bg-primary-50 text-primary-600',
  success: 'bg-success-50 text-success-600',
  warning: 'bg-warning-50 text-warning-600',
  error:   'bg-error-50   text-error-600',
  neutral: 'bg-neutral-100 text-neutral-600',
};

export function StatCard({ label, value, delta, icon, color = 'primary' }: StatCardProps) {
  return (
    <div className="stat-card animate-fade-up">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-500">{label}</span>
        {icon && (
          <span className={['w-9 h-9 rounded-md flex items-center justify-center', iconColors[color]].join(' ')}>
            {icon}
          </span>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-neutral-900 tracking-tight">{value}</span>
        {delta && (
          <span className={['text-xs font-medium mb-1', delta.positive ? 'text-success-600' : 'text-error-600'].join(' ')}>
            {delta.positive ? '↑' : '↓'} {delta.value}
          </span>
        )}
      </div>
    </div>
  );
}
