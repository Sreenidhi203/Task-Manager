import { ReactNode, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Badge } from './Badge';

/* ─── Types ─────────────────────────────────────────────────────────────────── */
export interface NavItem {
  label:    string;
  to:       string;
  icon:     ReactNode;
  badge?:   string | number;
  exact?:   boolean;
}

export interface NavGroup {
  label?:   string;
  items:    NavItem[];
}

interface SidebarProps {
  groups:      NavGroup[];
  logo?:       ReactNode;
  footer?:     ReactNode;
  collapsed?:  boolean;
  onCollapse?: (v: boolean) => void;
}

/* ─── Sidebar ───────────────────────────────────────────────────────────────── */
export function Sidebar({ groups, logo, footer, collapsed, onCollapse }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={[
        'flex flex-col h-full bg-white border-r border-neutral-200 transition-all duration-200 ease-smooth',
        collapsed ? 'w-14' : 'w-56',
      ].join(' ')}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-neutral-100 shrink-0">
        {logo}
        {!collapsed && (
          <span className="text-base font-bold text-neutral-900 tracking-tight truncate">
            TaskFlow Pro
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4 no-scrollbar">
        {groups.map((group, gi) => (
          <div key={gi}>
            {group.label && !collapsed && (
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-3 mb-1">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = item.exact
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to);
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={[
                        'sidebar-item',
                        isActive ? 'active' : '',
                        collapsed ? 'justify-center px-0' : '',
                      ].join(' ')}
                      title={collapsed ? item.label : undefined}
                    >
                      <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                        {item.icon}
                      </span>
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge !== undefined && (
                            <Badge variant="primary" size="sm">{item.badge}</Badge>
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {footer && (
        <div className="shrink-0 border-t border-neutral-100 p-2">
          {footer}
        </div>
      )}

      {/* Collapse toggle */}
      {onCollapse && (
        <button
          onClick={() => onCollapse(!collapsed)}
          className="shrink-0 flex items-center justify-center h-9 border-t border-neutral-100
                     text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 transition-colors duration-150"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            width="14" height="14" viewBox="0 0 14 14" fill="none"
            className={['transition-transform duration-200', collapsed ? 'rotate-180' : ''].join(' ')}
          >
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </aside>
  );
}

/* ─── User menu (sidebar footer) ────────────────────────────────────────────── */
interface UserMenuProps {
  name:     string;
  email:    string;
  role:     string;
  avatar?:  string;
  onLogout: () => void;
  collapsed?: boolean;
}

export function UserMenu({ name, email, role, avatar, onLogout, collapsed }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={[
          'w-full flex items-center gap-2.5 px-2 py-2 rounded-md',
          'hover:bg-neutral-100 transition-colors duration-150 text-left',
          collapsed ? 'justify-center' : '',
        ].join(' ')}
      >
        {avatar ? (
          <img src={avatar} alt={name} className="w-7 h-7 rounded-full object-cover shrink-0" />
        ) : (
          <span className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold
                           flex items-center justify-center shrink-0">
            {initials}
          </span>
        )}
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-800 truncate">{name}</p>
            <p className="text-xs text-neutral-400 truncate">{role}</p>
          </div>
        )}
      </button>

      {open && !collapsed && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-neutral-200
                        rounded-md shadow-lg py-1 z-dropdown animate-fade-up">
          <div className="px-3 py-2 border-b border-neutral-100">
            <p className="text-xs font-medium text-neutral-800 truncate">{name}</p>
            <p className="text-xs text-neutral-400 truncate">{email}</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error-600
                       hover:bg-error-50 transition-colors duration-150"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 12H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3M9.5 9.5L13 7l-3.5-2.5M13 7H5"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
