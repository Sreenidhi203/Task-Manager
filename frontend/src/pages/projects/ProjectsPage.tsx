import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi, Project } from '../../api';
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

function ProjectCard({ project, canWrite, isAdmin, onEdit, onDelete, onView }: {
  project: Project; canWrite: boolean; isAdmin: boolean;
  onEdit: () => void; onDelete: () => void; onView: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="surface p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group animate-fade-up cursor-pointer" onClick={onView}>
      <div className="flex items-start justify-between gap-2">
        <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3zM9 3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V3zM2 10a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3zM9 11.5h6M12 8.5v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div className="relative" onClick={e => e.stopPropagation()}>
          {(canWrite || isAdmin) && (
            <button onClick={() => setMenuOpen(o => !o)} className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition-all">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="3" r="1" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="currentColor"/><circle cx="7" cy="11" r="1" fill="currentColor"/></svg>
            </button>
          )}
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 w-36 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg py-1 z-20 animate-scale-in">
                <button onClick={() => { setMenuOpen(false); onView(); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 6.5s2-4 5.5-4 5.5 4 5.5 4-2 4-5.5 4S1 6.5 1 6.5zM6.5 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  View
                </button>
                {canWrite && (
                  <button onClick={() => { setMenuOpen(false); onEdit(); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9 2l2 2-7 7H2V9l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Edit
                  </button>
                )}
                {isAdmin && (
                  <>
                    <div className="border-t border-neutral-100 dark:border-neutral-800 my-1" />
                    <button onClick={() => { setMenuOpen(false); onDelete(); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950 transition-colors">
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M5 3.5V2h3v1.5M10.5 3.5l-.5 7.5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1L2.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">{project.name}</h3>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 line-clamp-2">{project.description || 'No description'}</p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-neutral-100 dark:border-neutral-800">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLE[project.status] ?? ''}`}>
          {project.status.replace('_', ' ')}
        </span>
        <span className="text-xs text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 3h8M2 6h5M2 9h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          {project.taskCount} tasks
        </span>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const navigate = useNavigate();
  const qc       = useQueryClient();
  const role     = useAppSelector(s => s.auth.role);
  const canWrite = role === 'ADMIN' || role === 'MANAGER';
  const isAdmin  = role === 'ADMIN';

  const [keyword,  setKeyword]  = useState('');
  const [status,   setStatus]   = useState('');
  const [page,     setPage]     = useState(0);
  const pageSize = 12;

  const { data, isLoading } = useQuery({
    queryKey: ['projects', { keyword, status, page, pageSize }],
    queryFn:  () => projectsApi.list({ keyword: keyword || undefined, status: status || undefined, page, size: pageSize }),
  });

  const deleteMutation = useMutation({
    mutationFn: projectsApi.delete,
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });

  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="page-container space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 animate-fade-up">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">Projects</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {data?.totalElements ?? 0} project{(data?.totalElements ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
        {canWrite && (
          <button onClick={() => navigate('/projects/new')} className="inline-flex items-center gap-2 h-9 px-4 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all press-effect">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            New Project
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 animate-fade-up" style={{ animationDelay: '40ms' }}>
        <div className="relative">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
            <path d="M6.5 11.5a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM13 13l-2.5-2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input
            type="search" placeholder="Search projects…" value={keyword}
            onChange={e => { setKeyword(e.target.value); setPage(0); }}
            className="input-base pl-9 w-56"
          />
        </div>
        <select
          value={status} onChange={e => { setStatus(e.target.value); setPage(0); }}
          className="input-base w-36 cursor-pointer"
        >
          <option value="">All statuses</option>
          {['ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="surface p-5 space-y-3 animate-pulse">
              <Sk w="36px" h="36px" /><Sk w="60%" h="16px" /><Sk w="100%" h="12px" /><Sk w="80%" h="12px" />
              <div className="flex justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <Sk w="60px" h="20px" /><Sk w="50px" h="14px" />
              </div>
            </div>
          ))}
        </div>
      ) : data?.content.length === 0 ? (
        <div className="surface flex flex-col items-center justify-center py-16 text-center animate-fade-up">
          <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3 text-neutral-400">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 4a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4zM12 4a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V4zM3 13a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5zM15.5 15.5h6M18.5 12.5v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">No projects found</p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
            {keyword || status ? 'Try adjusting your filters' : 'Create your first project to get started'}
          </p>
          {canWrite && !keyword && !status && (
            <button onClick={() => navigate('/projects/new')} className="mt-4 inline-flex items-center gap-2 h-8 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors press-effect">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
              New Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data?.content.map(p => (
            <ProjectCard
              key={p.id} project={p} canWrite={canWrite} isAdmin={isAdmin}
              onView={() => navigate(`/projects/${p.id}`)}
              onEdit={() => navigate(`/projects/${p.id}/edit`)}
              onDelete={() => { if (confirm(`Delete "${p.name}"?`)) deleteMutation.mutate(p.id); }}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2 animate-fade-up">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
            className="h-8 px-3 text-sm font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Previous
          </button>
          <span className="text-sm text-neutral-500 dark:text-neutral-400 px-2">
            Page {page + 1} of {totalPages}
          </span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
            className="h-8 px-3 text-sm font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
