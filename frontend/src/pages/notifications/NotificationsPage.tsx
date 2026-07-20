import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../../api';
import { useAppSelector } from '../../hooks/useAppDispatch';

function Sk({ w = '100%', h = '14px' }: { w?: string; h?: string }) {
  return <div className="skeleton" style={{ width: w, height: h }} />;
}

const TYPE_STYLE: Record<string, string> = {
  INFO:    'bg-accent-50 dark:bg-accent-950 text-accent-700 dark:text-accent-400 border border-accent-200 dark:border-accent-800',
  WARNING: 'bg-warning-50 dark:bg-warning-950 text-warning-700 dark:text-warning-400 border border-warning-200 dark:border-warning-800',
  SUCCESS: 'bg-success-50 dark:bg-success-950 text-success-700 dark:text-success-400 border border-success-200 dark:border-success-800',
  ERROR:   'bg-error-50 dark:bg-error-950 text-error-700 dark:text-error-400 border border-error-200 dark:border-error-800',
};

export default function NotificationsPage() {
  const qc     = useQueryClient();
  const userId = useAppSelector(s => s.auth.userId);

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', userId],
    queryFn:  () => notificationsApi.list({ size: 50 }),
    enabled:  Boolean(userId),
  });

  const markReadMutation = useMutation({
    mutationFn: notificationsApi.markRead,
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
  const markAllMutation = useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['notifications'] }); qc.invalidateQueries({ queryKey: ['unread-count'] }); },
  });

  const unreadCount = data?.content.filter(n => !n.read).length ?? 0;

  return (
    <div className="page-container max-w-2xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 animate-fade-up">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">Notifications</h2>
            {unreadCount > 0 && (
              <span className="text-xs font-semibold bg-error-100 dark:bg-error-900 text-error-700 dark:text-error-300 px-2 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {data?.totalElements ?? 0} notification{(data?.totalElements ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllMutation.mutate()}
            disabled={markAllMutation.isPending}
            className="inline-flex items-center gap-2 h-8 px-3 text-sm font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            {markAllMutation.isPending
              ? <span className="w-3.5 h-3.5 rounded-full border-2 border-neutral-300 border-t-neutral-600 animate-spin" />
              : <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            }
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="surface overflow-hidden animate-fade-up" style={{ animationDelay: '40ms' }}>
        {isLoading ? (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-5 py-4 flex gap-3 animate-pulse">
                <div className="skeleton w-2 h-2 rounded-full mt-1.5 shrink-0" style={{width:'8px',height:'8px',borderRadius:'50%'}} /><div className="flex-1 space-y-2"><Sk w="40%" h="13px" /><Sk w="70%" h="13px" /><Sk w="30%" h="11px" /></div>
              </div>
            ))}
          </div>
        ) : data?.content.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3 text-neutral-400">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2a7 7 0 0 0-7 7v3.5L2 14v.5h18V14l-2-1.5V9a7 7 0 0 0-7-7zM9 17.5a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">All caught up!</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">No notifications yet</p>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {data?.content.map(n => (
              <li
                key={n.id}
                className={`px-5 py-4 flex items-start gap-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/30 ${!n.read ? 'bg-primary-50/30 dark:bg-primary-950/20' : ''}`}
              >
                {/* Unread dot */}
                <div className="mt-1.5 shrink-0">
                  <div className={`w-2 h-2 rounded-full transition-colors ${n.read ? 'bg-neutral-200 dark:bg-neutral-700' : 'bg-primary-500'}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-semibold truncate ${n.read ? 'text-neutral-700 dark:text-neutral-300' : 'text-neutral-900 dark:text-neutral-100'}`}>
                          {n.title}
                        </p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${TYPE_STYLE[n.type] ?? ''}`}>
                          {n.type}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">{n.message}</p>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1.5">
                        {new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {new Date(n.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {!n.read && (
                      <button
                        onClick={() => markReadMutation.mutate(n.id)}
                        disabled={markReadMutation.isPending}
                        title="Mark as read"
                        className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                      >
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3 3 6-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
