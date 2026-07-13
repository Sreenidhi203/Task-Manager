import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useProjects } from '@/hooks/useProjects';

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: 'bg-emerald-500/20 text-emerald-300',
  ON_HOLD: 'bg-amber-500/20 text-amber-300',
  COMPLETED: 'bg-cyan-500/20 text-cyan-300',
  ARCHIVED: 'bg-slate-500/20 text-slate-400',
};

export function ProjectsPage() {
  const {
    projects, loading, error,
    keyword, status, page, pageCount, totalElements,
    search, filterStatus, setPage, remove,
  } = useProjects();

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[28px] border border-slate-800 bg-slate-900/80 p-6 shadow-2xl sm:p-8">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">Project Management</p>
            <h1 className="mt-2 text-3xl font-semibold">Projects</h1>
            <p className="mt-1 text-sm text-slate-400">{totalElements} project{totalElements !== 1 ? 's' : ''} total</p>
          </div>
          <Link to="/projects/new"><Button>+ New Project</Button></Link>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            value={keyword}
            onChange={(e) => search(e.target.value)}
            placeholder="Search projects…"
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
          <select
            value={status}
            onChange={(e) => filterStatus(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="COMPLETED">Completed</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>
        )}

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-950/70 text-left text-slate-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3 hidden md:table-cell">Description</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 hidden lg:table-cell">Owner</th>
                <th className="px-4 py-3 hidden lg:table-cell">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/60">
              {loading && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">Loading…</td></tr>}
              {!loading && projects.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No projects found.</td></tr>}
              {!loading && projects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium">
                    <Link to={`/projects/${p.id}`} className="text-cyan-300 hover:text-cyan-200">{p.name}</Link>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-slate-400 max-w-xs truncate">{p.description ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[p.status ?? ''] ?? 'bg-slate-700 text-slate-300'}`}>
                      {p.status ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-slate-400">{p.ownerName ?? '—'}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-slate-400">
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/projects/${p.id}`} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800">View</Link>
                      <Link to={`/projects/${p.id}/edit`} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800">Edit</Link>
                      <button
                        onClick={() => window.confirm('Delete this project?') && remove(p.id)}
                        className="rounded-lg border border-rose-500/40 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/10"
                      >Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-slate-400">Page {page + 1} of {pageCount}</p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0}>Previous</Button>
            <Button onClick={() => setPage((p) => p + 1)} disabled={page + 1 >= pageCount}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
