import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi, Task } from '../../api';
import { useAppSelector } from '../../hooks/useAppDispatch';

function Sk({ w = '100%', h = '14px' }: { w?: string; h?: string }) {
  return <div className="skeleton" style={{ width: w, height: h }} />;
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

function TaskRow({ task, isAdmin, onDelete }: {
  task: Task; isAdmin: boolean; onDelete: () => void;
}) {
  const navigate = useNavigate();
  const isOverdue = task.dueDate && task.status !== 'DONE' && new Date(task.dueDate) < new Date();

  return (
    <tr
      className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors group"
      onClick={() => navigate(`/tasks/${task.id}`)}
    >
      <td className="px-4 py-3">
        <p className="font-medium text-neutral-800 dark:text-neutral-200 truncate max-w-[220px] group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{task.title}</p>
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
      <td className="px-4 py-3">
        <span className={`text-xs ${isOverdue ? 'text-error-600 dark:text-error-400 font-medium' : 'text-neutral-400 dark:text-neutral-500'}`}>
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
          {isOverdue && ' ⚠'}
        </span>
      </td>
      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => navigate(`/tasks/${task.id}`)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors" title="View">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 6.5s2-4 5.5-4 5.5 4 5.5 4-2 4-5.5 4S1 6.5 1 6.5zM6.5 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </button>
          {isAdmin && (
            <button onClick={onDelete} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-error-50 dark:hover:bg-error-950 text-neutral-400 hover:text-error-600 dark:hover:text-error-400 transition-colors" title="Delete">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M5 3.5V2h3v1.5M10.5 3.5l-.5 7.5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1L2.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function TasksPage() {
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();
  const qc             = useQueryClient();
  const role           = useAppSelector(s => s.auth.role);
  const canWrite       = role === 'ADMIN' || role === 'MANAGER';
  const isAdmin        = role === 'ADMIN';

  const [keyword,  setKeyword]  = useState('');
  const [status,   setStatus]   = useState('');
  const [priority, setPriority] = useState('');
  const [page,     setPage]     = useState(0);
  const pageSize = 20;

  const projectId = searchParams.get('projectId') ?? undefined;

  const { data, isLoading } = useQuery({
    queryKey: ['tasks', { keyword, status, priority, projectId, page, pageSize }],
    queryFn:  () => tasksApi.list({ keyword: keyword || undefined, status: status || undefined, priority: priority || undefined, projectId: projectId || undefined, page, size: pageSize }),
  });

  const deleteMutation = useMutation({
    mutationFn: tasksApi.delete,
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="page-container space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 animate-fade-up">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">Tasks</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {data?.totalElements ?? 0} task{(data?.totalElements ?? 0) !== 1 ? 's' : ''}
            {projectId ? ' in this project' : ' across all projects'}
          </p>
        </div>
        {canWrite && (
          <button onClick={() => navigate('/tasks/new')} className="inline-flex items-center gap-2 h-9 px-4 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all press-effect">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            New Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 animate-fade-up" style={{ animationDelay: '40ms' }}>
        <div className="relative">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
            <path d="M6.5 11.5a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM13 13l-2.5-2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input type="search" placeholder="Search tasks…" value={keyword} onChange={e => { setKeyword(e.target.value); setPage(0); }} className="input-base pl-9 w-52" />
        </div>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(0); }} className="input-base w-36 cursor-pointer">
          <option value="">All statuses</option>
          {['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'BLOCKED'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <select value={priority} onChange={e => { setPriority(e.target.value); setPage(0); }} className="input-base w-36 cursor-pointer">
          <option value="">All priorities</option>
          {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        {(keyword || status || priority) && (
          <button onClick={() => { setKeyword(''); setStatus(''); setPriority(''); setPage(0); }}
            className="h-9 px-3 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="surface overflow-hidden animate-fade-up" style={{ animationDelay: '60ms' }}>
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-1">
                <div className="flex-1 space-y-1.5"><Sk w="50%" h="14px" /><Sk w="30%" h="11px" /></div>
                <Sk w="60px" h="20px" /><Sk w="80px" h="20px" /><Sk w="50px" h="14px" />
              </div>
            ))}
          </div>
        ) : data?.content.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3 text-neutral-400">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 6h14M4 11h10M4 16h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">No tasks found</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
              {keyword || status || priority ? 'Try adjusting your filters' : 'Create your first task to get started'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  {['Task', 'Priority', 'Status', 'Due', ''].map((h, i) => (
                    <th key={i} className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.content.map(t => (
                  <TaskRow key={t.id} task={t} canWrite={canWrite} isAdmin={isAdmin}
                    onDelete={() => { if (confirm(`Delete "${t.title}"?`)) deleteMutation.mutate(t.id); }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2 animate-fade-up">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
            className="h-8 px-3 text-sm font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Previous
          </button>
          <span className="text-sm text-neutral-500 dark:text-neutral-400 px-2">Page {page + 1} of {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
            className="h-8 px-3 text-sm font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
