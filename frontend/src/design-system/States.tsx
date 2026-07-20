import { ReactNode } from 'react';
import { Button } from './Button';

/* ─── Empty State ───────────────────────────────────────────────────────────── */
interface EmptyStateProps {
  icon?:        ReactNode;
  title:        string;
  description?: string;
  action?:      { label: string; onClick: () => void };
  compact?:     boolean;
}

export function EmptyState({ icon, title, description, action, compact }: EmptyStateProps) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center text-center animate-fade-up',
        compact ? 'py-8 px-4' : 'py-16 px-6',
      ].join(' ')}
    >
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-neutral-800 mb-1">{title}</h3>
      {description && <p className="text-sm text-neutral-500 max-w-xs text-balance">{description}</p>}
      {action && (
        <Button variant="primary" size="sm" className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

/* ─── Error State ───────────────────────────────────────────────────────────── */
interface ErrorStateProps {
  title?:       string;
  description?: string;
  onRetry?:     () => void;
  compact?:     boolean;
}

export function ErrorState({ title = 'Something went wrong', description, onRetry, compact }: ErrorStateProps) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center text-center animate-fade-up',
        compact ? 'py-8 px-4' : 'py-16 px-6',
      ].join(' ')}
    >
      <div className="w-12 h-12 rounded-xl bg-error-50 flex items-center justify-center text-error-500 mb-4">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 6v4m0 4h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-neutral-800 mb-1">{title}</h3>
      {description && <p className="text-sm text-neutral-500 max-w-xs text-balance">{description}</p>}
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

/* ─── Not Found State ───────────────────────────────────────────────────────── */
interface NotFoundProps {
  title?:       string;
  description?: string;
  action?:      { label: string; onClick: () => void };
}

export function NotFound({ title = 'Not found', description = 'The resource you\'re looking for doesn\'t exist.', action }: NotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 animate-fade-up">
      <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-300 mb-5">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M14 2C7.373 2 2 7.373 2 14s5.373 12 12 12 12-5.373 12-12S20.627 2 14 2Z"
            stroke="currentColor" strokeWidth="1.5"/>
          <path d="M10 10l8 8M18 10l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <h3 className="text-base font-semibold text-neutral-800 mb-1">{title}</h3>
      <p className="text-sm text-neutral-500 max-w-xs text-balance">{description}</p>
      {action && (
        <Button variant="primary" size="sm" className="mt-5" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

/* ─── Inline alert ──────────────────────────────────────────────────────────── */
type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?:  AlertVariant;
  title?:    string;
  children:  ReactNode;
  onDismiss?: () => void;
}

const alertStyles: Record<AlertVariant, { wrap: string; icon: string; iconEl: ReactNode }> = {
  info: {
    wrap: 'bg-primary-50 border-primary-200 text-primary-800',
    icon: 'text-primary-500',
    iconEl: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1a6 6 0 1 0 0 12A6 6 0 0 0 7 1Zm0 4v3m0 2h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  success: {
    wrap: 'bg-success-50 border-success-200 text-success-800',
    icon: 'text-success-500',
    iconEl: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2.5 7.5l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  warning: {
    wrap: 'bg-warning-50 border-warning-200 text-warning-800',
    icon: 'text-warning-500',
    iconEl: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1L1 13h12L7 1Zm0 5v3m0 2h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  error: {
    wrap: 'bg-error-50 border-error-200 text-error-800',
    icon: 'text-error-500',
    iconEl: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1a6 6 0 1 0 0 12A6 6 0 0 0 7 1ZM7 5v3m0 2h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
};

export function Alert({ variant = 'info', title, children, onDismiss }: AlertProps) {
  const s = alertStyles[variant];
  return (
    <div className={['flex gap-3 p-3 rounded-md border text-sm animate-fade-down', s.wrap].join(' ')} role="alert">
      <span className={['mt-0.5 shrink-0', s.icon].join(' ')}>{s.iconEl}</span>
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div className="opacity-90">{children}</div>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} aria-label="Dismiss" className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}
