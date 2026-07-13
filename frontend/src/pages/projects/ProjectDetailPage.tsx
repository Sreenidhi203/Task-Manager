import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useApi, useMutation } from '@/hooks/useApi';
import { getProjectById, deleteProject } from '@/features/projects/api';

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: 'bg-emerald-500/20 text-emerald-300',
  ON_HOLD: 'bg-amber-500/20 text-amber-300',
  COMPLETED: 'bg-cyan-500/20 text-cyan-300',
  ARCHIVED: 'bg-slate-500/20 text-slate-400',
};

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3">
      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-200">{value ?? '—'}</p>
    </div>
  );
}

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, loading, error } = useApi(() => getProjectById(Number(id)), [id]);
  const deleteMutation = useMutation((pid: number) => deleteProject(pid).then(() => ({ data: null })));

  const handleDelete = async () => {
    if (!project || !window.confirm('Delete this project?')) return;
    await deleteMutation.execute(project.id);
    if (!deleteMutation.error) navigate('/projects');
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">Loading…</div>;

  if (error || !project) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 text-slate-400">
      <p>{error ?? 'Project not found.'}</p>
      <Link to="/projects"><Button variant="secondary">Back to Projects</Button></Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[28px] border border-slate-800 bg-slate-900/80 p-6 shadow-2xl sm:p-8">

        <div className="flex items-start justify-between gap-4">
          <div>
            <Link to="/projects" className="text-xs text-slate-500 hover:text-slate-300">← Back to Projects</Link>
            <h1 className="mt-3 text-2xl font-semibold">{project.name}</h1>
            <span className={`mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[project.status ?? ''] ?? 'bg-slate-700 text-slate-300'}`}>
              {project.status ?? '—'}
            </span>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link to={`/projects/${project.id}/edit`}><Button variant="secondary">Edit</Button></Link>
            <button
              onClick={handleDelete}
              disabled={deleteMutation.loading}
              className="rounded-lg border border-rose-500/40 px-4 py-2 text-sm font-medium text-rose-300 hover:bg-rose-500/10 disabled:opacity-50"
            >
              {deleteMutation.loading ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>

        {deleteMutation.error && (
          <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{deleteMutation.error}</div>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-slate-500">Description</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-200">{project.description || '—'}</p>
          </div>
          <Field label="Owner" value={project.ownerName} />
          <Field label="Owner ID" value={project.ownerId} />
          <Field label="Created At" value={project.createdAt ? new Date(project.createdAt).toLocaleString() : undefined} />
          <Field label="Updated At" value={project.updatedAt ? new Date(project.updatedAt).toLocaleString() : undefined} />
        </div>
      </div>
    </div>
  );
}
