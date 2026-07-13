import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { deleteTask, getTaskById } from '@/features/tasks/api';
import type { TaskItem } from '@/features/tasks/types';

export function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [task, setTask] = useState<TaskItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const load = async () => {
      if (!id) return;
      const res = await getTaskById(Number(id));
      setTask(res.data);
      setLoading(false);
    };

    load();
  }, [id, isAuthenticated, navigate]);

  const handleDelete = async () => {
    if (!task?.id || !window.confirm('Delete this task?')) return;
    await deleteTask(task.id);
    navigate('/tasks');
  };

  if (loading) return <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">Loading...</div>;
  if (!task) return <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">Task not found.</div>;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[28px] border border-slate-800 bg-slate-900/80 p-6 shadow-2xl sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">Task Details</p>
            <h1 className="mt-2 text-3xl font-semibold">{task.title}</h1>
          </div>
          <div className="flex gap-2">
            <Link to={`/tasks/${task.id}/edit`}><Button variant="secondary">Edit</Button></Link>
            <Button variant="secondary" onClick={handleDelete}>Delete</Button>
            <Link to="/tasks"><Button>Back to list</Button></Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm text-slate-400">Description</p>
            <p className="mt-2 text-sm text-slate-200">{task.description || 'No description provided.'}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm text-slate-400">Status</p>
            <p className="mt-2 text-lg font-semibold text-cyan-300">{task.status ?? 'TODO'}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm text-slate-400">Priority</p>
            <p className="mt-2 text-lg font-semibold text-amber-300">{task.priority ?? 'MEDIUM'}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm text-slate-400">Due Date</p>
            <p className="mt-2 text-lg font-semibold">{task.dueDate ?? '—'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
