import { ReactNode } from 'react';

interface TopbarProps {
  title?:   string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: ReactNode;
  search?:  ReactNode;
}

export function Topbar({ title, breadcrumbs, actions, search }: TopbarProps) {
  return (
    <header className="h-14 shrink-0 flex items-center justify-between gap-4 px-6
                       bg-white border-b border-neutral-200 sticky top-0 z-sticky">
      {/* Left */}
      <div className="flex items-center gap-2 min-w-0">
        {breadcrumbs ? (
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-neutral-300">/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="text-neutral-500 hover:text-neutral-800 transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="font-semibold text-neutral-900">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : (
          title && <h1 className="text-base font-semibold text-neutral-900 tracking-tight truncate">{title}</h1>
        )}
      </div>

      {/* Center — search */}
      {search && <div className="flex-1 max-w-xs">{search}</div>}

      {/* Right — actions */}
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </header>
  );
}

/* ─── Notification bell ─────────────────────────────────────────────────────── */
interface NotificationBellProps {
  count?:   number;
  onClick?: () => void;
}

export function NotificationBell({ count, onClick }: NotificationBellProps) {
  return (
    <button
      onClick={onClick}
      aria-label={`Notifications${count ? ` (${count} unread)` : ''}`}
      className="relative w-9 h-9 flex items-center justify-center rounded-md text-neutral-500
                 hover:text-neutral-800 hover:bg-neutral-100 transition-colors duration-150"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1a5 5 0 0 0-5 5v2.5L1.5 10v.5h13V10L13 8.5V6a5 5 0 0 0-5-5ZM6.5 13a1.5 1.5 0 0 0 3 0"
          stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {count !== undefined && count > 0 && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error-500 ring-2 ring-white" />
      )}
    </button>
  );
}
