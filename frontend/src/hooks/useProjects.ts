import { useCallback, useEffect, useState } from 'react';
import { getProjects, deleteProject } from '@/features/projects/api';
import type { ProjectItem } from '@/features/projects/types';

export function useProjects() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProjects({
        keyword: keyword || undefined,
        status: status || undefined,
        page,
        size: 8,
      });
      setProjects(res.data.content ?? []);
      setPageCount(res.data.totalPages || 1);
      setTotalElements(res.data.totalElements ?? 0);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [keyword, status, page]);

  useEffect(() => { load(); }, [load]);

  const remove = async (id: number) => {
    await deleteProject(id);
    load();
  };

  const search = (kw: string) => { setPage(0); setKeyword(kw); };
  const filterStatus = (s: string) => { setPage(0); setStatus(s); };

  return {
    projects, loading, error,
    keyword, status, page, pageCount, totalElements,
    search, filterStatus, setPage, remove, refetch: load,
  };
}
