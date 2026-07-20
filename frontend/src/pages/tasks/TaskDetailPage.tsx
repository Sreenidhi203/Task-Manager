import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../../api';
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

const STATUSES = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'BLOCKED'];

export default function TaskDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc       = useQueryClient();
  const role     = useAppSelector(s => s.auth.role);
  const userId   = useAppSelector(s => s.auth.userId);
  const email    = useAppSelector(s => s.auth.email);
  const canWrite = role === 'ADMIN' || role === 'MANAGER';
  const isAdmin  = role === 'ADMIN';

  const [comment, setComment] = useState('');

  const { data: task, isLoading } = useQuery({
    queryKey: ['task', id],
    queryFn:  () => tasksApi.getById(Number(id)),
  });
  const { data: comments, isLoading: loadingComments } = useQuery({
    queryKey: ['comments', id],
    queryFn:  () => tasksApi.getComments(Number(id)),
    enabled:  Boolean(id),
  });

  const updateMutation = useMutation({
    mutationFn: (status: string) => tasksApi.update(Number(id), { status }),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['task', id] }),
  });
  const commentMutation = useMutation({
    mutationFn: (content: string) => tasksApi.addComment(Number(id), content),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['comments', id] }); setComment(''); },
  });
  const deleteCommentMutation = useMutation({
    mutationFn: (cid: number) => tasksApi.deleteComment(Number(id), cid),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['comments', id] }),
  });

  if (isLoading) {
    return (
      <div className="page-container max-w-3xl space-y-5">
        <Sk w="120px" h="20px" />
        <div className="surface p-6 space-y-4 animate-pulse">
          <div className="flex justify-between"><Sk w="50%" h="24px" /><div className="flex gap-2"><Sk w="70px" h="24px" /><Sk w="80px" h="24px" /></div></div>
          <Sk w="80%" h="14px" /><Sk w="60%" h="14px" />
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            {[1,2,3].map(i => <div key={i} className="space-y-1"><Sk w="50%" h="11px" /><Sk w="80%" h="14px" /></div>)}
          </div>
        </div>
      </div>
    );
  }

  if (!task) return (
    <div className="page-container max-w-3xl">
      <div className="surface p-8 text-center text-neutral-500 dark:text-neutral-400">Task not found.</div>
    </div>
  );

  const isOverdue = task.dueDate && task.status !== 'DONE' && new Date(task.dueDate) < new Date();

  return (
    <div className="page-container max-w-3xl space-y-5">
      {/* Back */}
      <button onClick={() => navigate('/tasks')} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors animate-fade-up">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Back to Tasks
      </button>

      {/* Task card */}
      <div className="surface p-6 animate-fade-up">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight flex-1">{task.title}</h2>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${PRIORITY_STYLE[task.priority] ?? ''}`}>{task.priority}</span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLE[task.status] ?? ''}`}>{task.status.replace('_', ' ')}</span>
          </div>
        </div>

        {task.description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3 leading-relaxed">{task.description}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <div>
            <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">Project</p>
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{task.projectName}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">Due Date</p>
            <p className={`text-sm font-medium ${isOverdue ? 'text-error-600 dark:text-error-400' : 'text-neutral-800 dark:text-neutral-200'}`}>
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'}
              {isOverdue && ' ⚠'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">Created</p>
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
              {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Status update */}
        {(canWrite || true) && (
          <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => updateMutation.mutate(s)}
                  disabled={task.status === s || updateMutation.isPending}
                  className={[
                    'h-7 px-3 text-xs font-medium rounded-full border transition-all press-effect',
                    task.status === s
                      ? `${STATUS_STYLE[s]} border-current opacity-100 cursor-default`
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800',
                    'disabled:cursor-not-allowed',
                  ].join(' ')}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Comments */}
      <div className="surface overflow-hidden animate-fade-up" style={{ animationDelay: '60ms' }}>
        <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Comments <span className="text-neutral-400 dark:text-neutral-500 font-normal">({comments?.totalElements ?? 0})</span>
          </h3>
        </div>

        {/* Comment input */}
        <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {email?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1">
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && comment.trim()) { e.preventDefault(); commentMutation.mutate(comment.trim()); } }}
                placeholder="Add a comment… (⌘Enter to submit)"
                rows={3}
                className="w-full px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg placeholder:text-neutral-400 dark:placeholder:text-neutral-600 resize-none transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-neutral-900"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => comment.trim() && commentMutation.mutate(comment.trim())}
                  disabled={!comment.trim() || commentMutation.isPending}
                  className="inline-flex items-center gap-2 h-8 px-4 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed press-effect"
                >
                  {commentMutation.isPending && <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
                  Comment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comment list */}
        {loadingComments ? (
          <div className="p-5 space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="skeleton shrink-0" style={{width:'28px',height:'28px',borderRadius:'50%'}} /><div className="flex-1 space-y-2"><Sk w="30%" h="12px" /><Sk w="80%" h="14px" /><Sk w="60%" h="14px" /></div>
              </div>
            ))}
          </div>
        ) : comments?.content.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-neutral-400 dark:text-neutral-600">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="mb-2 opacity-50"><path d="M4 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8l-4 4V6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <p className="text-sm">No comments yet. Be the first!</p>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {comments?.content.map(c => {
              const canDelete = isAdmin || c.authorId === userId;
              const initials  = c.authorName?.[0]?.toUpperCase() ?? '?';
              return (
                <li key={c.id} className="px-5 py-4 flex gap-3 group hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neutral-300 to-neutral-400 dark:from-neutral-600 dark:to-neutral-700 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">{c.authorName}</span>
                        <span className="text-xs text-neutral-400 dark:text-neutral-500">
                          {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {new Date(c.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {canDelete && (
                        <button
                          onClick={() => deleteCommentMutation.mutate(c.id)}
                          className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-md hover:bg-error-50 dark:hover:bg-error-950 text-neutral-300 hover:text-error-500 dark:hover:text-error-400 transition-all"
                          title="Delete comment"
                        >
                          <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1.5 3h8M4 3V2h3v1M9.5 3l-.5 6.5a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1-.5-.5L1.5 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1 leading-relaxed">{c.content}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
