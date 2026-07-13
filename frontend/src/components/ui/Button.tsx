import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  const base = 'rounded-lg px-4 py-2 font-medium transition-colors';
  const styles =
    variant === 'primary'
      ? 'bg-cyan-600 text-white hover:bg-cyan-500'
      : 'border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800';

  return (
    <button className={`${base} ${styles} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
