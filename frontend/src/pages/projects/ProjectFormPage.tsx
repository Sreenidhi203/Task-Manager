import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { createProject, getProjectById, updateProject } from '@/features/projects/api';
import type { ProjectPayload } from '@/features/projects/types';

const STATUSES = ['ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED'];

export function ProjectFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<ProjectPayload>({ name: '', description: '', status: 'ACTIVE' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!isEdit) return;
    setLoading(true);
    getProjectById(Number(id))
      .then((res) => {
        const p = res.data;
        setForm({ name: p.name, description: p.description ?? '', status: p.status ?? 'ACTIVE', ownerId: p.ownerId });
      })
      .catch(() => setError('Failed to load project.'))
      .finally(() => setLoading(false));
  }, [id, isAuthenticated]);

  const set = (field: keyof ProjectPayload) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Project name is required.'); return; }
    setSaving(true);
    setError('');
    try {
      if (isEdit) {
        await updateProject(Number(id), form);
        navigate(`/projects/${id}`);
      } else {
        const res = await createProject(form);
        navigate(`/projects/${res.data.id}`);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-[28px] border border-slate-800 bg-slate-900/80 p-6 shadow-2xl sm:p-8">

        <Link to={isEdit ? `/projects/${id}` : '/projects'} className="text-xs text-slate-500 hover:text-slate-300">
          ← {isEdit ? 'Back to Project' : 'Back to Projects'}
        </Link>

        <div className="mt-4">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">Project Management</p>
          <h1 className="mt-2 text-2xl font-semibold">{isEdit ? 'Edit Project' : 'New Project'}</h1>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs text-slate-400">Project Name *</label>
            <input
              value={form.name}
              onChange={set('name')}
              maxLength={150}
              placeholder="Enter project name"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-slate-400">Description</label>
            <textarea
              value={form.description}
              onChange={set('description')}
              maxLength={2000}
              rows={4}
              placeholder="Enter project description"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-slate-400">Status</label>
            <select
              value={form.status}
              onChange={set('status')}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Project'}
            </Button>
            <Link to={isEdit ? `/projects/${id}` : '/projects'} className="flex-1">
              <Button type="button" variant="secondary" className="w-full">Cancel</Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
