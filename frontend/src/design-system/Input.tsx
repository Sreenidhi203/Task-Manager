import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';

/* ─── Input ─────────────────────────────────────────────────────────────────── */
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?:    string;
  hint?:     string;
  error?:    string;
  prefix?:   ReactNode;
  suffix?:   ReactNode;
  fullWidth?: boolean;
}

const inputBase =
  'w-full h-9 px-3 text-sm text-neutral-900 bg-white border rounded-md ' +
  'placeholder:text-neutral-400 transition-all duration-150 ' +
  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 focus:border-primary-500 ' +
  'disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, prefix, suffix, fullWidth, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
            {props.required && <span className="text-error-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <span className="absolute left-3 text-neutral-400 flex items-center pointer-events-none">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              inputBase,
              error ? 'border-error-400 focus:ring-error-500 focus:border-error-500' : 'border-neutral-300',
              prefix ? 'pl-9' : '',
              suffix ? 'pr-9' : '',
              className,
            ].join(' ')}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 text-neutral-400 flex items-center pointer-events-none">
              {suffix}
            </span>
          )}
        </div>
        {error  && <p className="form-error">{error}</p>}
        {!error && hint && <p className="form-hint">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

/* ─── Textarea ──────────────────────────────────────────────────────────────── */
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?:    string;
  hint?:     string;
  error?:    string;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, fullWidth, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
            {props.required && <span className="text-error-500 ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={props.rows ?? 3}
          className={[
            'w-full px-3 py-2 text-sm text-neutral-900 bg-white border rounded-md resize-y',
            'placeholder:text-neutral-400 transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed',
            error ? 'border-error-400 focus:ring-error-500' : 'border-neutral-300',
            className,
          ].join(' ')}
          {...props}
        />
        {error  && <p className="form-error">{error}</p>}
        {!error && hint && <p className="form-hint">{hint}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

/* ─── Select ────────────────────────────────────────────────────────────────── */
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?:    string;
  hint?:     string;
  error?:    string;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, fullWidth, className = '', id, children, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
            {props.required && <span className="text-error-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            className={[
              'w-full h-9 pl-3 pr-8 text-sm text-neutral-900 bg-white border rounded-md appearance-none',
              'transition-all duration-150 cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
              'disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed',
              error ? 'border-error-400 focus:ring-error-500' : 'border-neutral-300',
              className,
            ].join(' ')}
            {...props}
          >
            {children}
          </select>
          {/* Chevron */}
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
        {error  && <p className="form-error">{error}</p>}
        {!error && hint && <p className="form-hint">{hint}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

/* ─── Search Input ──────────────────────────────────────────────────────────── */
export const SearchInput = forwardRef<HTMLInputElement, Omit<InputProps, 'prefix'>>(
  (props, ref) => (
    <Input
      ref={ref}
      type="search"
      prefix={
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M6.5 11.5a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM13 13l-2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      }
      {...props}
    />
  )
);
SearchInput.displayName = 'SearchInput';
