import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  projectId: z.coerce.number({ invalid_type_error: 'Project ID is required' }),
  assigneeId: z.coerce.number().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  dueDate: z.string().optional(),
});

type TaskFormValues = z.infer<typeof schema>;

interface TaskFormProps {
  initialValues?: Partial<TaskFormValues>;
  onSubmit: (values: TaskFormValues) => Promise<void> | void;
  submitting?: boolean;
  submitLabel?: string;
}

export function TaskForm({ initialValues, onSubmit, submitting = false, submitLabel = 'Save Task' }: TaskFormProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      projectId: 1,
      assigneeId: undefined,
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: '',
      ...initialValues,
    },
  });

  useEffect(() => {
    form.reset({
      title: initialValues?.title ?? '',
      description: initialValues?.description ?? '',
      projectId: initialValues?.projectId ?? 1,
      assigneeId: initialValues?.assigneeId ?? undefined,
      status: initialValues?.status ?? 'TODO',
      priority: initialValues?.priority ?? 'MEDIUM',
      dueDate: initialValues?.dueDate ?? '',
    });
  }, [initialValues, form]);

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <label className="mb-1 block text-sm text-slate-300">Title</label>
        <input {...form.register('title')} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm" />
        {form.formState.errors.title ? <p className="mt-1 text-sm text-rose-300">{form.formState.errors.title.message}</p> : null}
      </div>
      <div>
        <label className="mb-1 block text-sm text-slate-300">Description</label>
        <textarea {...form.register('description')} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm" rows={4} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-slate-300">Project ID</label>
          <input type="number" {...form.register('projectId')} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-300">Assignee ID</label>
          <input type="number" {...form.register('assigneeId')} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-slate-300">Status</label>
          <select {...form.register('status')} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm">
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-300">Priority</label>
          <select {...form.register('priority')} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm text-slate-300">Due Date</label>
        <input type="date" {...form.register('dueDate')} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm" />
      </div>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? 'Saving...' : submitLabel}
      </Button>
    </form>
  );
}
