import { ReactNode } from 'react';
import { EmptyState } from './States';
import { Spinner } from './Spinner';

/* ─── Column definition ─────────────────────────────────────────────────────── */
export interface Column<T> {
  key:       string;
  header:    string;
  render?:   (row: T) => ReactNode;
  width?:    string;
  align?:    'left' | 'center' | 'right';
  sortable?: boolean;
}

interface TableProps<T> {
  columns:    Column<T>[];
  data:       T[];
  keyField:   keyof T;
  loading?:   boolean;
  emptyTitle?: string;
  emptyDesc?:  string;
  onRowClick?: (row: T) => void;
  sortKey?:    string;
  sortDir?:    'asc' | 'desc';
  onSort?:     (key: string) => void;
}

export function Table<T>({
  columns, data, keyField, loading, emptyTitle = 'No results', emptyDesc,
  onRowClick, sortKey, sortDir, onSort,
}: TableProps<T>) {
  return (
    <div className="surface overflow-hidden">
      <div className="scroll-x">
        <table className="tf-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}
                >
                  {col.sortable && onSort ? (
                    <button
                      onClick={() => onSort(col.key)}
                      className="inline-flex items-center gap-1 hover:text-neutral-800 transition-colors"
                    >
                      {col.header}
                      <SortIcon active={sortKey === col.key} dir={sortDir} />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  <div className="flex justify-center">
                    <Spinner size="md" className="text-primary-500" />
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState title={emptyTitle} description={emptyDesc} compact />
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={String(row[keyField])}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={onRowClick ? 'cursor-pointer' : ''}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}
                    >
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SortIcon({ active, dir }: { active: boolean; dir?: 'asc' | 'desc' }) {
  return (
    <span className={['transition-colors', active ? 'text-primary-600' : 'text-neutral-300'].join(' ')}>
      {active && dir === 'desc' ? (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ) : (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 6.5L5 3.5L8 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )}
    </span>
  );
}

/* ─── Pagination ────────────────────────────────────────────────────────────── */
interface PaginationProps {
  page:       number;
  totalPages: number;
  total:      number;
  pageSize:   number;
  onChange:   (page: number) => void;
}

export function Pagination({ page, totalPages, total, pageSize, onChange }: PaginationProps) {
  const start = (page - 1) * pageSize + 1;
  const end   = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100">
      <p className="text-xs text-neutral-500">
        Showing <span className="font-medium text-neutral-700">{start}–{end}</span> of{' '}
        <span className="font-medium text-neutral-700">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <PagBtn onClick={() => onChange(page - 1)} disabled={page <= 1} label="Previous">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M7.5 2L3.5 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </PagBtn>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const p = i + 1;
          return (
            <PagBtn key={p} onClick={() => onChange(p)} active={p === page} label={`Page ${p}`}>
              {p}
            </PagBtn>
          );
        })}
        <PagBtn onClick={() => onChange(page + 1)} disabled={page >= totalPages} label="Next">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </PagBtn>
      </div>
    </div>
  );
}

function PagBtn({ onClick, disabled, active, label, children }: {
  onClick: () => void; disabled?: boolean; active?: boolean; label: string; children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className={[
        'w-7 h-7 flex items-center justify-center rounded text-xs font-medium transition-colors duration-100',
        active
          ? 'bg-primary-600 text-white'
          : 'text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
