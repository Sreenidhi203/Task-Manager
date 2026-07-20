import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../../api';

const schema = z.object({
  name:        z.string().min(1, 'Name is required').max(255),
  description: z.string().optional(),
  status:      z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function Sk({ w = '100%', h = '14px' }: { w?: string; h?: string }) {
  return <div className="skeleton" style={{ width: w, height: h }} />;
}

export default function ProjectFormPage() {
  const { id }   = useParams<{ id: string }>();
  const isEdit   = Boolean(id);
  const navigate = useNavigate();
  const qc       = useQueryClient();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn:  () => projectsApi.getById(Number(id)),
    enabled:  isEdit,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (project) reset({ name: project.name, description: project.description, status: project.status });
  }, [project, reset]);

  const createMutation = useMutation({
    mutationFn: projectsApi.create,
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['projects'] }); navigate('/projects'); },
  });
  const updateMutation = useMutation({
    mutationFn: (data: FormData) => projectsApi.update(Number(id), data),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['projects'] }); navigate('/projects'); },
  });

  const onSubmit = (data: FormData) => isEdit ? updateMutation.mutate(data) : createMutation.mutate(data);
  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutError  = (createMutation.error || updateMutation.error) as Error | null;

  if (isEdit && isLoading) {
    return (
      <div className="page-container max-w-xl space-y-5">
        <Sk w="120px" h="20px" />
        <div className="surface p-6 space-y-4 animate-pulse">
          <Sk w="40%" h="14px" /><Sk w="100%" h="36px" />
          <Sk w="40%" h="14px" /><Sk w="100%" h="80px" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-xl space-y-5">
      {/* Back */}
      <button onClick={() => navigate('/projects')} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors animate-fade-up">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Back to Projects
      </button>

      <div className="surface p-6 animate-fade-up">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
            {isEdit ? 'Edit Project' : 'New Project'}
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {isEdit ? 'Update project details' : 'Create a new project workspace for your team'}
          </p>
        </div>

        {mutError && (
          <div className="mb-4 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-error-50 dark:bg-error-950 border border-error-200 dark:border-error-800 text-error-700 dark:text-error-400 text-sm">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0"><path d="M7 1a6 6 0 1 0 0 12A6 6 0 0 0 7 1zM7 4v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            {mutError.message || 'Something went wrong'}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="form-label">Project name <span className="text-error-500">*</span></label>
            <input type="text" placeholder="e.g. Website Redesign" className={`input-base ${errors.name ? 'border-error-400 focus:ring-error-500' : ''}`} {...register('name')} />
            {errors.name && <p className="form-error">{errors.name.message}</p>}
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              rows={4} placeholder="Describe the project goals and scope…"
              className="w-full px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg placeholder:text-neutral-400 dark:placeholder:text-neutral-600 resize-y transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              {...register('description')}
            />
          </div>

          {isEdit && (
            <div>
              <label className="form-label">Status</label>
              <select className="input-base cursor-pointer" {...register('status')}>
                {['ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED'].map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={isPending}
              className="inline-flex items-center gap-2 h-9 px-5 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed press-effect">
              {isPending && <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
              {isEdit ? 'Save changes' : 'Create project'}
            </button>
            <button type="button" onClick={() => navigate('/projects')}
              className="h-9 px-4 text-sm font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
