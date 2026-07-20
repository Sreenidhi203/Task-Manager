import { HTMLAttributes, ReactNode, useState, useRef, useEffect } from 'react';

/* ─── Avatar ────────────────────────────────────────────────────────────────── */
type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  name:    string;
  src?:    string;
  size?:   AvatarSize;
  status?: 'online' | 'offline' | 'away';
}

const avatarSizes: Record<AvatarSize, string> = {
  xs: 'w-5 h-5 text-xs',
  sm: 'w-7 h-7 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-sm',
  xl: 'w-12 h-12 text-base',
};

const statusColors = {
  online:  'bg-success-500',
  offline: 'bg-neutral-300',
  away:    'bg-warning-400',
};

export function Avatar({ name, src, size = 'md', status }: AvatarProps) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return (
    <span className="relative inline-flex shrink-0">
      {src ? (
        <img src={src} alt={name} className={['rounded-full object-cover', avatarSizes[size]].join(' ')} />
      ) : (
        <span className={[
          'rounded-full bg-primary-100 text-primary-700 font-semibold flex items-center justify-center',
          avatarSizes[size],
        ].join(' ')}>
          {initials}
        </span>
      )}
      {status && (
        <span className={[
          'absolute bottom-0 right-0 w-2 h-2 rounded-full ring-2 ring-white',
          statusColors[status],
        ].join(' ')} />
      )}
    </span>
  );
}

/* ─── Avatar group ──────────────────────────────────────────────────────────── */
export function AvatarGroup({ names, max = 3 }: { names: string[]; max?: number }) {
  const visible = names.slice(0, max);
  const rest    = names.length - max;
  return (
    <div className="flex -space-x-2">
      {visible.map((name, i) => (
        <span key={i} className="ring-2 ring-white rounded-full">
          <Avatar name={name} size="sm" />
        </span>
      ))}
      {rest > 0 && (
        <span className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-600 text-xs font-semibold
                         flex items-center justify-center ring-2 ring-white">
          +{rest}
        </span>
      )}
    </div>
  );
}

/* ─── Dropdown ──────────────────────────────────────────────────────────────── */
export interface DropdownItem {
  label:    string;
  icon?:    ReactNode;
  onClick?: () => void;
  danger?:  boolean;
  divider?: boolean;
  disabled?: boolean;
}

interface DropdownProps {
  trigger:  ReactNode;
  items:    DropdownItem[];
  align?:   'left' | 'right';
}

export function Dropdown({ trigger, items, align = 'right' }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={[
            'absolute top-full mt-1 min-w-[160px] bg-white border border-neutral-200 rounded-md shadow-lg py-1 z-dropdown animate-scale-in',
            align === 'right' ? 'right-0' : 'left-0',
          ].join(' ')}
        >
          {items.map((item, i) => (
            item.divider ? (
              <div key={i} className="my-1 border-t border-neutral-100" />
            ) : (
              <button
                key={i}
                disabled={item.disabled}
                onClick={() => { item.onClick?.(); setOpen(false); }}
                className={[
                  'w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors duration-100',
                  item.danger
                    ? 'text-error-600 hover:bg-error-50'
                    : 'text-neutral-700 hover:bg-neutral-50',
                  item.disabled ? 'opacity-40 cursor-not-allowed' : '',
                ].join(' ')}
              >
                {item.icon && (
                  <span className="w-4 h-4 flex items-center justify-center opacity-70">{item.icon}</span>
                )}
                {item.label}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Tooltip ───────────────────────────────────────────────────────────────── */
interface TooltipProps {
  content:  string;
  children: ReactNode;
  side?:    'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const positions = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left:   'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right:  'left-full top-1/2 -translate-y-1/2 ml-1.5',
  };
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          className={[
            'absolute z-toast whitespace-nowrap px-2 py-1 text-xs font-medium',
            'bg-neutral-900 text-white rounded shadow-md pointer-events-none animate-fade-in',
            positions[side],
          ].join(' ')}
          role="tooltip"
        >
          {content}
        </span>
      )}
    </span>
  );
}

/* ─── Divider ───────────────────────────────────────────────────────────────── */
interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export function Divider({ label, className = '', ...props }: DividerProps) {
  if (!label) return <div className={['border-t border-neutral-200', className].join(' ')} {...props} />;
  return (
    <div className={['flex items-center gap-3', className].join(' ')} {...props}>
      <div className="flex-1 border-t border-neutral-200" />
      <span className="text-xs text-neutral-400 font-medium">{label}</span>
      <div className="flex-1 border-t border-neutral-200" />
    </div>
  );
}

/* ─── Progress bar ──────────────────────────────────────────────────────────── */
interface ProgressProps {
  value:   number;
  max?:    number;
  color?:  'primary' | 'success' | 'warning' | 'error';
  size?:   'sm' | 'md';
  label?:  string;
}

const progressColors = {
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error:   'bg-error-500',
};

export function Progress({ value, max = 100, color = 'primary', size = 'sm', label }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div>
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-neutral-500">{label}</span>
          <span className="text-xs font-medium text-neutral-700">{Math.round(pct)}%</span>
        </div>
      )}
      <div className={['w-full bg-neutral-100 rounded-full overflow-hidden', size === 'sm' ? 'h-1.5' : 'h-2.5'].join(' ')}>
        <div
          className={['h-full rounded-full transition-all duration-500 ease-out', progressColors[color]].join(' ')}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
