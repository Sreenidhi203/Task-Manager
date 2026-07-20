import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';

type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface DialogProps {
  open:       boolean;
  onClose:    () => void;
  title?:     string;
  subtitle?:  string;
  children:   ReactNode;
  footer?:    ReactNode;
  size?:      DialogSize;
  hideClose?: boolean;
}

const sizes: Record<DialogSize, string> = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  full: 'max-w-5xl',
};

export function Dialog({ open, onClose, title, subtitle, children, footer, size = 'md', hideClose }: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="overlay-backdrop flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'dialog-title' : undefined}
    >
      <div
        className={[
          'w-full bg-white rounded-lg shadow-2xl border border-neutral-200 animate-scale-in',
          sizes[size],
        ].join(' ')}
      >
        {/* Header */}
        {(title || !hideClose) && (
          <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-neutral-100">
            <div>
              {title && (
                <h2 id="dialog-title" className="text-base font-semibold text-neutral-900 tracking-tight">
                  {title}
                </h2>
              )}
              {subtitle && <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>}
            </div>
            {!hideClose && (
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md text-neutral-400
                           hover:text-neutral-600 hover:bg-neutral-100 transition-colors duration-150"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 px-6 pb-5 pt-2 border-t border-neutral-100">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

/* ── Confirm dialog ── */
interface ConfirmDialogProps {
  open:        boolean;
  onClose:     () => void;
  onConfirm:   () => void;
  title:       string;
  description: string;
  confirmLabel?: string;
  danger?:     boolean;
  loading?:    boolean;
}

export function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = 'Confirm', danger, loading }: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant={danger ? 'danger' : 'primary'} size="sm" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-neutral-600">{description}</p>
    </Dialog>
  );
}
