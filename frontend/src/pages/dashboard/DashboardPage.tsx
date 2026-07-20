import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { projectsApi, tasksApi, Task } from '../../api';
import { useAppSelector } from '../../hooks/useAppDispatch';

function Sk({ w = '100%', h = '16px', circle = false }: { w?: string; h?: string; circle?: boolean }) {
  return <div className="skeleton" style={{ width: w, height: h, borderRadius: circle ? '50%' : undefined }} />;
}

function StatCard({ label, value, icon, color, loading }: {
  label: string; value: number; icon: React.ReactNode; color: string; loading: boolean;
}) {
  return (
    <div className="stat-card animate-fade-up">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{label}</span>
        <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>{icon}</span>
      </div>
      {loading
        ? <Sk w="60px" h="36px" />
        : <span className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">{value}</span>
      }
    </div>
  );
}

const PRIORITY_STYLE: Record<string, string> = {
  URGENT: 'bg-error-50 dark:bg-error-950 text-error-700 dark:text-error-400 border border-error-200 dark:border-error-800',
  HIGH:   'bg-warning-50 dark:bg-warning-950 text-warning-700 dark:text-warning-400 border border-warning-200 dark:border-warning-800',
  MEDIUM: 'bg-accent-50 dark:bg-accent-950 text-accent-700 dark:text-accent-400 border border-accent-200 dark:border-accent-800',
  LOW:    'bg-success-50 dark:bg-success-950 text-success-700 dark:text-success-400 border border-success-200 dark:border-success-800',
};
const STATUS_STYLE: Record<string, string> = {
  TODO:        'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400',
  IN_PROGRESS: 'bg-accent-50 dark:bg-accent-950 text-accent-700 dark:text-accent-400',
  REVIEW:      'bg-warning-50 dark:bg-warning-950 text-warning-700 dark:text-warning-400',
  DONE:        'bg-success-50 dark:bg-success-950 text-success-700 dark:text-success-400',
  BLOCKED:     'bg-error-50 dark:bg-error-950 text-error-700 dark:text-error-400',
};

function TaskRow({ task }: { task: Task }) {
  const navigate = useNavigate();
  return (
    <tr
      className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors"
      onClick={() => navigate(`/tasks/${task.id}`)}
    >
      <td className="px-4 py-3">
        <p className="font-medium text-neutral-800 dark:text-neutral-200 truncate max-w-[200px]">{task.title}</p>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 truncate">{task.projectName}</p>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_STYLE[task.priority] ?? ''}`}>
          {task.priority}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLE[task.status] ?? ''}`}>
          {task.status.replace('_', ' ')}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-neutral-400 dark:text-neutral-500 whitespace-nowrap">
        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
      </td>
    </tr>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const email    = useAppSelector(s => s.auth.email);
  const role     = useAppSelector(s => s.auth.role);

  const { data: projects,       isLoading: lp } = useQuery({ queryKey: ['projects', { size: 1 }],          queryFn: () => projectsApi.list({ size: 1 }) });
  const { data: tasks,          isLoading: lt } = useQuery({ queryKey: ['tasks', 'all-count'],              queryFn: () => tasksApi.list({ size: 1 }) });
  const { data: doneTasks }                      = useQuery({ queryKey: ['tasks', 'done-count'],             queryFn: () => tasksApi.list({ status: 'DONE', size: 1 }) });
  const { data: inProgressTasks }                = useQuery({ queryKey: ['tasks', 'inprogress-count'],       queryFn: () => tasksApi.list({ status: 'IN_PROGRESS', size: 1 }) });
  const { data: recentTasks,    isLoading: lr }  = useQuery({ queryKey: ['tasks', 'recent'],                queryFn: () => tasksApi.list({ size: 8, sortBy: 'createdAt', dir: 'desc' }) });

  const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; };
  const name = email?.split('@')[0] ?? 'there';

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <div className="animate-fade-up">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
          {greeting()}, <span className="gradient-text">{name}</span> 👋
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · {role}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Projects"   value={projects?.totalElements ?? 0}       loading={lp} color="bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400"
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3zM9 3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V3zM2 10a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3zM9 11.5h6M12 8.5v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>} />
        <StatCard label="Total Tasks" value={tasks?.totalElements ?? 0}          loading={lt} color="bg-accent-50 dark:bg-accent-950 text-accent-600 dark:text-accent-400"
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 4h10M3 8h7M3 12h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>} />
        <StatCard label="In Progress" value={inProgressTasks?.totalElements ?? 0} loading={lt} color="bg-warning-50 dark:bg-warning-950 text-warning-600 dark:text-warning-400"
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v4l2.5 2.5M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>} />
        <StatCard label="Completed"   value={doneTasks?.totalElements ?? 0}       loading={lt} color="bg-success-50 dark:bg-success-950 text-success-600 dark:text-success-400"
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>} />
      </div>

      {/* Recent Tasks */}
      <div className="surface overflow-hidden animate-fade-up" style={{ animationDelay: '60ms' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Recent Tasks</h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">Latest activity across all projects</p>
          </div>
          <button onClick={() => navigate('/tasks')} className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors flex items-center gap-1">
            View all
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        {lr ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-1">
                <Sk w="35%" h="14px" /><Sk w="60px" h="20px" /><Sk w="80px" h="20px" /><Sk w="50px" h="14px" />
              </div>
            ))}
          </div>
        ) : recentTasks?.content.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-neutral-400 dark:text-neutral-600">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-3 opacity-50"><path d="M6 8h20M6 16h14M6 24h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            <p className="text-sm">No tasks yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  {['Task', 'Priority', 'Status', 'Due'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>{recentTasks?.content.map(t => <TaskRow key={t.id} task={t} />)}</tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: '100ms' }}>
        {[
          { label: 'New Project', desc: 'Create a new project workspace', to: '/projects/new', color: 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-900', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg> },
          { label: 'Browse Tasks', desc: 'View and manage all tasks',      to: '/tasks',        color: 'bg-accent-50 dark:bg-accent-950 text-accent-600 dark:text-accent-400 group-hover:bg-accent-100 dark:group-hover:bg-accent-900',   icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 5h12M3 9h8M3 13h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg> },
        ].map(a => (
          <button key={a.to} onClick={() => navigate(a.to)} className="surface p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${a.color}`}>{a.icon}</div>
            <div>
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{a.label}</p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">{a.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
