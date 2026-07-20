import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectsApi, tasksApi, Task } from '../../api';
import { useAppSelector } from '../../hooks/useAppDispatch';

function Sk({ w = '100%', h = '14px' }: { w?: string; h?: string }) {
  return <div className="skeleton" style={{ width: w, height: h }} />;
}

const STATUS_STYLE: Record<string, string> = {
  ACTIVE:    'bg-success-50 dark:bg-success-950 text-success-700 dark:text-success-400 border border-success-200 dark:border-success-800',
  ON_HOLD:   'bg-warning-50 dark:bg-warning-950 text-warning-700 dark:text-warning-400 border border-warning-200 dark:border-warning-800',
  COMPLETED: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700',
  ARCHIVED:  'bg-error-50 dark:bg-error-950 text-error-700 dark:text-error-400 border border-error-200 dark:border-error-800',
};
const TASK_STATUS_STYLE: Record<string, string> = {
  TODO:        'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400',
  IN_PROGRESS: 'bg-accent-50 dark:bg-accent-950 text-accent-700 dark:text-accent-400',
  REVIEW:      'bg-warning-50 dark:bg-warning-950 text-warning-700 dark:text-warning-400',
  DONE:        'bg-success-50 dark:bg-success-950 text-success-700 dark:text-success-400',
  BLOCKED:     'bg-error-50 dark:bg-error-950 text-error-700 dark:text-error-400',
};
const PRIORITY_STYLE: Record<string, string> = {
  URGENT: 'bg-error-50 dark:bg-error-950 text-error-700 dark:text-error-400 border border-error-200 dark:border-error-800',
  HIGH:   'bg-warning-50 dark:bg-warning-950 text-warning-700 dark:text-warning-400 border border-warning-200 dark:border-warning-800',
  MEDIUM: 'bg-accent-50 dark:bg-accent-950 text-accent-700 dark:text-accent-400 border border-accent-200 dark:border-accent-800',
  LOW:    'bg-success-50 dark:bg-success-950 text-success-700 dark:text-success-400 border border-success-200 dark:border-success-800',
};

function TaskCard({ task }: { task: Task }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/tasks/${task.id}`)}
      className="surface p-4 flex flex-col gap-2.5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer animate-fade-up"
    >
      <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 line-clamp-2">{task.title}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TASK_STATUS_STYLE[task.status] ?? ''}`}>
          {task.status.replace('_', ' ')}
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_STYLE[task.priority] ?? ''}`}>
          {task.priority}
        </span>
      </div>
      {task.dueDate && (
        <p className="text-xs text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1 4h9M3 1v2M8 1v2M1.5 2h8a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5z" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
          {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </p>
      )}
    </div>
  );
}

export default function ProjectDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const role     = useAppSelector(s => s.auth.role);
  const canWrite = role === 'ADMIN' || role === 'MANAGER';

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn:  () => projectsApi.getById(Number(id)),
  });
  const { data: tasks, isLoading: loadingTasks } = useQuery({
    queryKey: ['tasks', { projectId: id }],
    queryFn:  () => tasksApi.list({ projectId: id, size: 50 }),
    enabled:  Boolean(id),
  });

  return (
    <div className="page-container space-y-6">
      {/* Back */}
      <button onClick={() => navigate('/projects')} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors animate-fade-up">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Back to Projects
      </button>

      {/* Project header */}
      {isLoading ? (
        <div className="surface p-6 space-y-3 animate-pulse">
          <div className="flex justify-between"><Sk w="40%" h="24px" /><Sk w="70px" h="24px" /></div>
          <Sk w="70%" h="14px" /><Sk w="50%" h="14px" />
        </div>
      ) : project ? (
        <div className="surface p-6 animate-fade-up">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4zM11 4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V4zM3 12a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4zM14 14.5h6M17 11.5v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">{project.name}</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-xl">{project.description || 'No description provided.'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLE[project.status] ?? ''}`}>
                {project.status.replace('_', ' ')}
              </span>
              {canWrite && (
                <button onClick={() => navigate(`/projects/${id}/edit`)} className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9 2l2 2-7 7H2V9l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Edit
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-400 dark:text-neutral-500">
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 3h10M3 1v2M9 1v2M1.5 2h9a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5z" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
              Created {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 3h8M2 6h5M2 9h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
              {project.taskCount} tasks
            </span>
          </div>
        </div>
      ) : (
        <div className="surface p-8 text-center text-neutral-500 dark:text-neutral-400">Project not found.</div>
      )}

      {/* Tasks */}
      <div className="animate-fade-up" style={{ animationDelay: '60ms' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Tasks</h3>
          {canWrite && (
            <button onClick={() => navigate(`/tasks?projectId=${id}`)} className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors flex items-center gap-1">
              View all tasks
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          )}
        </div>

        {loadingTasks ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="surface p-4 space-y-2.5 animate-pulse">
                <Sk w="80%" h="14px" /><Sk w="60%" h="14px" />
                <div className="flex gap-2"><Sk w="60px" h="20px" /><Sk w="60px" h="20px" /></div>
              </div>
            ))}
          </div>
        ) : tasks?.content.length === 0 ? (
          <div className="surface flex flex-col items-center justify-center py-12 text-center">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3 text-neutral-400">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 5h12M3 9h8M3 13h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">No tasks yet</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Tasks assigned to this project will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks?.content.map(t => <TaskCard key={t.id} task={t} />)}
          </div>
        )}
      </div>
    </div>
  );
}
