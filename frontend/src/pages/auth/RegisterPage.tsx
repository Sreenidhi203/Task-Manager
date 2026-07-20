import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { register as registerAction } from '../../store/slices/authSlice';

const schema = z.object({
  username: z.string().min(3, 'Min 3 characters'),
  fullName: z.string().min(1, 'Full name is required'),
  email:    z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
});
type FormData = z.infer<typeof schema>;

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      {children}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useAppSelector(s => s.auth);
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => { if (token) navigate('/dashboard'); }, [token, navigate]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-4">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-100 dark:bg-primary-950 blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent-100 dark:bg-accent-950 blur-3xl opacity-60" />
      </div>

      <div className="w-full max-w-sm animate-fade-up">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center mb-3 shadow-primary-md">
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
              <path d="M2 3h10M2 7h6M2 11h8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">Create account</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Start managing tasks with your team</p>
        </div>

        <div className="surface p-6">
          {error && (
            <div className="mb-4 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-error-50 dark:bg-error-950 border border-error-200 dark:border-error-800 text-error-700 dark:text-error-400 text-sm animate-fade-down">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                <path d="M7 1a6 6 0 1 0 0 12A6 6 0 0 0 7 1zM7 4v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(d => dispatch(registerAction(d)))} className="space-y-4">
            <Field label="Username" error={errors.username?.message}>
              <input type="text" autoComplete="username" placeholder="johndoe" className={`input-base ${errors.username ? 'border-error-400' : ''}`} {...register('username')} />
            </Field>

            <Field label="Full name" error={errors.fullName?.message}>
              <input type="text" autoComplete="name" placeholder="John Doe" className={`input-base ${errors.fullName ? 'border-error-400' : ''}`} {...register('fullName')} />
            </Field>

            <Field label="Email" error={errors.email?.message}>
              <input type="email" autoComplete="email" placeholder="you@company.com" className={`input-base ${errors.email ? 'border-error-400' : ''}`} {...register('email')} />
            </Field>

            <Field label="Password" error={errors.password?.message}>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min 8 characters"
                  className={`input-base pr-10 ${errors.password ? 'border-error-400' : ''}`}
                  {...register('password')}
                />
                <button type="button" onClick={() => setShowPw(v => !v)} tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7s2.5-4.5 6-4.5S13 7 13 7s-2.5 4.5-6 4.5S1 7 1 7zM7 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-9 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed press-effect mt-2"
            >
              {loading && <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
