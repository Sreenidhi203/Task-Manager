import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { deleteTask, getTasks } from '@/features/tasks/api';
import type { TaskItem } from '@/features/tasks/types';

export function TasksPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [direction, setDirection] = useState('desc');
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await getTasks({ keyword, status, priority, page, size: 8, sortBy, direction });
      setTasks(res.data.content ?? []);
      setPageCount(res.data.totalPages || 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadTasks();
  }, [keyword, status, priority, sortBy, direction, page, isAuthenticated, navigate]);

  const canGoBack = page > 0;
  const canGoNext = page + 1 < pageCount;

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this task?')) return;
    await deleteTask(id);
    await loadTasks();
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[28px] border border-slate-800 bg-slate-900/80 p-6 shadow-2xl sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">Task Management</p>
            <h1 className="mt-2 text-3xl font-semibold">Task Center</h1>
            <p className="mt-2 text-sm text-slate-400">Search, filter, sort, and manage tasks across the platform.</p>
          </div>
          <Link to="/tasks/new">
            <Button>Create Task</Button>
          </Link>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          <input value={keyword} onChange={(e) => { setPage(0); setKeyword(e.target.value); }} placeholder="Search tasks" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm" />
          <select value={status} onChange={(e) => { setPage(0); setStatus(e.target.value); }} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm">
            <option value="">All statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
            <option value="BLOCKED">Blocked</option>
          </select>
          <select value={priority} onChange={(e) => { setPage(0); setPriority(e.target.value); }} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm">
            <option value="">All priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm">
            <option value="createdAt">Created At</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <select value={direction} onChange={(e) => setDirection(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm">
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-950/70 text-left text-slate-400">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/60">
              {loading ? <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">Loading tasks...</td></tr> : null}
              {!loading && tasks.length === 0 ? <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">No tasks found.</td></tr> : null}
              {!loading && tasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-800/60">
                  <td className="px-4 py-3">
                    <Link to={`/tasks/${task.id}`} className="font-medium text-cyan-300">{task.title}</Link>
                  </td>
                  <td className="px-4 py-3">{task.status ?? 'TODO'}</td>
                  <td className="px-4 py-3">{task.priority ?? 'MEDIUM'}</td>
                  <td className="px-4 py-3">{task.dueDate ?? '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/tasks/${task.id}/edit`} className="rounded-lg border border-slate-700 px-3 py-2 text-xs">Edit</Link>
                      <button onClick={() => handleDelete(task.id)} className="rounded-lg border border-rose-500/40 px-3 py-2 text-xs text-rose-300">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-slate-400">Page {page + 1} of {pageCount}</p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setPage((prev) => Math.max(prev - 1, 0))} disabled={!canGoBack}>Previous</Button>
            <Button onClick={() => setPage((prev) => prev + 1)} disabled={!canGoNext}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
