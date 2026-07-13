import { useCallback, useEffect, useState } from 'react';
import { getTasks, deleteTask } from '@/features/tasks/api';
import type { TaskItem } from '@/features/tasks/types';

export function useTasks() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [direction, setDirection] = useState('desc');
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTasks({
        keyword: keyword || undefined,
        status: status || undefined,
        priority: priority || undefined,
        page,
        size: 8,
        sortBy,
        direction,
      });
      setTasks(res.data.content ?? []);
      setPageCount(res.data.totalPages || 1);
      setTotalElements(res.data.totalElements ?? 0);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [keyword, status, priority, sortBy, direction, page]);

  useEffect(() => { load(); }, [load]);

  const remove = async (id: number) => {
    await deleteTask(id);
    load();
  };

  const search = (kw: string) => { setPage(0); setKeyword(kw); };
  const filterStatus = (s: string) => { setPage(0); setStatus(s); };
  const filterPriority = (p: string) => { setPage(0); setPriority(p); };

  return {
    tasks, loading, error,
    keyword, status, priority, sortBy, direction,
    page, pageCount, totalElements,
    search, filterStatus, filterPriority, setSortBy, setDirection, setPage,
    remove, refetch: load,
  };
}
