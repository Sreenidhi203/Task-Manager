import { useState, useEffect, useCallback } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { logout } from '../../store/slices/authSlice';
import { notificationsApi } from '../../api';

/* ── Icons ── */
function Icon({ d, size = 16 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
const Icons = {
  dashboard:     'M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z',
  projects:      'M2 3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3zM9 3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V3zM2 10a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3zM9 11.5h6M12 8.5v6',
  tasks:         'M3 4h10M3 8h7M3 12h5',
  notifications: 'M8 1.5a4.5 4.5 0 0 0-4.5 4.5v2.25L2 9.5v.5h12v-.5l-1.5-1.25V6A4.5 4.5 0 0 0 8 1.5ZM6.5 12.5a1.5 1.5 0 0 0 3 0',
  menu:          'M2 4h12M2 8h12M2 12h12',
  close:         'M3 3l10 10M13 3L3 13',
  logout:        'M6 12H2.5a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5H6M10.5 10.5L14 8l-3.5-2.5M14 8H6',
  sun:           'M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.2 3.2l1 1M11.8 11.8l1 1M11.8 3.2l-1 1M3.2 11.8l1-1M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
  moon:          'M6.5 2A6 6 0 1 0 14 9.5 4.5 4.5 0 0 1 6.5 2z',
  chevronLeft:   'M10 3L5 8l5 5',
  chevronRight:  'M6 3l5 5-5 5',
  user:          'M8 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 14a6 6 0 0 1 12 0',
};

const NAV = [
  { label: 'Dashboard',     to: '/dashboard',     icon: Icons.dashboard,     exact: true },
  { label: 'Projects',      to: '/projects',      icon: Icons.projects },
  { label: 'Tasks',         to: '/tasks',         icon: Icons.tasks },
  { label: 'Notifications', to: '/notifications', icon: Icons.notifications },
];

/* ── Dark mode hook ── */
function useDarkMode() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const toggle = useCallback(() => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }, [dark]);
  return { dark, toggle };
}

/* ── Sidebar content ── */
function SidebarContent({
  collapsed, unreadCount, onNavigate,
}: { collapsed: boolean; unreadCount: number; onNavigate?: () => void }) {
  const location = useLocation();
  return (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-2.5 h-14 border-b border-neutral-200 dark:border-neutral-800 shrink-0 ${collapsed ? 'justify-center px-3' : 'px-4'}`}>
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 3h10M2 7h6M2 11h8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        {!collapsed && (
          <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">TaskFlow</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 no-scrollbar">
        {NAV.map(item => {
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          const isNotif = item.to === '/notifications';
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              className={[
                'sidebar-item',
                isActive ? 'active' : '',
                collapsed ? 'justify-center px-0' : '',
              ].join(' ')}
            >
              <span className="w-4 h-4 shrink-0 flex items-center justify-center relative">
                <Icon d={item.icon} />
                {isNotif && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-error-500 ring-1 ring-white dark:ring-neutral-900" />
                )}
              </span>
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {isNotif && unreadCount > 0 && (
                    <span className="text-xs font-semibold bg-error-100 dark:bg-error-900 text-error-700 dark:text-error-300 px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}

export default function AppLayout() {
  const navigate  = useNavigate();
  const dispatch  = useAppDispatch();
  const email     = useAppSelector(s => s.auth.email);
  const role      = useAppSelector(s => s.auth.role);
  const { dark, toggle: toggleDark } = useDarkMode();

  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { data: unread } = useQuery({
    queryKey: ['unread-count'],
    queryFn:  notificationsApi.unreadCount,
    refetchInterval: 30_000,
  });
  const unreadCount = unread?.count ?? 0;

  // Close mobile drawer on resize
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Keyboard shortcut: Cmd/Ctrl+B to toggle sidebar
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') { e.preventDefault(); setCollapsed(c => !c); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };
  const initials = email ? email[0].toUpperCase() : '?';
  const location = useLocation();

  const pageTitle = NAV.find(n =>
    n.exact ? location.pathname === n.to : location.pathname.startsWith(n.to)
  )?.label ?? 'TaskFlow';

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 overflow-hidden">

      {/* ── Desktop Sidebar ── */}
      <aside className={[
        'hidden md:flex flex-col h-full bg-white dark:bg-neutral-900',
        'border-r border-neutral-200 dark:border-neutral-800',
        'transition-all duration-200 ease-smooth shrink-0',
        collapsed ? 'w-14' : 'w-56',
      ].join(' ')}>
        <SidebarContent collapsed={collapsed} unreadCount={unreadCount} />

        {/* User section */}
        <div className="shrink-0 border-t border-neutral-200 dark:border-neutral-800 p-2">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(o => !o)}
              className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 ${collapsed ? 'justify-center' : ''}`}
            >
              <span className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {initials}
              </span>
              {!collapsed && (
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">{email}</p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate">{role}</p>
                </div>
              )}
            </button>

            {userMenuOpen && !collapsed && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg py-1 z-50 animate-fade-up">
                <button
                  onClick={() => { setUserMenuOpen(false); navigate('/profile'); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  <Icon d={Icons.user} size={14} /> Profile
                </button>
                <div className="border-t border-neutral-100 dark:border-neutral-800 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950 transition-colors"
                >
                  <Icon d={Icons.logout} size={14} /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? 'Expand sidebar (⌘B)' : 'Collapse sidebar (⌘B)'}
          className="shrink-0 flex items-center justify-center h-8 border-t border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        >
          <Icon d={collapsed ? Icons.chevronRight : Icons.chevronLeft} size={13} />
        </button>
      </aside>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-neutral-900/50 dark:bg-neutral-950/70 backdrop-blur-sm z-40 md:hidden animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 z-50 flex flex-col animate-slide-in-left md:hidden">
            <div className="flex items-center justify-between px-4 h-14 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 3h10M2 7h6M2 11h8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">TaskFlow</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500">
                <Icon d={Icons.close} size={14} />
              </button>
            </div>
            <SidebarContent collapsed={false} unreadCount={unreadCount} onNavigate={() => setMobileOpen(false)} />
            <div className="shrink-0 border-t border-neutral-200 dark:border-neutral-800 p-3">
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950 rounded-lg transition-colors">
                <Icon d={Icons.logout} size={14} /> Sign out
              </button>
            </div>
          </aside>
        </>
      )}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="h-14 shrink-0 flex items-center justify-between gap-4 px-4 sm:px-6 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 transition-colors"
              aria-label="Open menu"
            >
              <Icon d={Icons.menu} />
            </button>
            <h1 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              aria-label="Toggle dark mode"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
            >
              <Icon d={dark ? Icons.sun : Icons.moon} />
            </button>

            {/* Notifications */}
            <button
              onClick={() => navigate('/notifications')}
              aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ''}`}
              className="relative w-9 h-9 flex items-center justify-center rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
            >
              <Icon d={Icons.notifications} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error-500 ring-2 ring-white dark:ring-neutral-900" />
              )}
            </button>

            {/* Avatar */}
            <button
              onClick={() => setUserMenuOpen(o => !o)}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 text-white text-xs font-bold flex items-center justify-center hover:ring-2 hover:ring-primary-400 hover:ring-offset-2 dark:hover:ring-offset-neutral-900 transition-all"
            >
              {initials}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Click-outside for user menu */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
    </div>
  );
}
