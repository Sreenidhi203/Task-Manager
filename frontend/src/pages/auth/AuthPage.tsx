import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { login as loginRequest, register as registerRequest } from '@/services/auth';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().optional(),
  role: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '', fullName: '', role: 'EMPLOYEE' },
  });

  const handleLogin = async (values: LoginFormValues) => {
    setError(null);
    setLoading(true);
    try {
      const auth = await loginRequest(values.email, values.password);
      login(auth.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: RegisterFormValues) => {
    setError(null);
    setLoading(true);
    try {
      const auth = await registerRequest({
        username: values.username,
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        role: values.role,
      });
      login(auth.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_35%),linear-gradient(135deg,#020617,#111827)] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur xl:flex-row">
        <div className="flex flex-1 flex-col justify-between bg-slate-950/70 p-8 lg:p-12">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">
              Enterprise Access
            </p>
            <h1 className="text-3xl font-semibold sm:text-4xl">Simplify task collaboration with secure access.</h1>
            <p className="mt-4 max-w-xl text-base text-slate-400 sm:text-lg">
              Authenticate quickly, keep team work organized, and manage your workspace with confidence.
            </p>
          </div>
          <div className="mt-8 grid gap-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">JWT-based sessions with automatic token refresh support.</div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">Protected routes and secure API access for all team members.</div>
          </div>
        </div>

        <div className="flex-1 p-6 sm:p-8 lg:p-12">
          <div className="mb-6 flex rounded-full border border-slate-800 bg-slate-950/70 p-1">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${mode === 'login' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${mode === 'register' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
            >
              Register
            </button>
          </div>

          {error ? <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</div> : null}

          {mode === 'login' ? (
            <form className="space-y-4" onSubmit={loginForm.handleSubmit(handleLogin)}>
              <div>
                <label className="mb-1 block text-sm text-slate-300">Email</label>
                <input
                  type="email"
                  {...loginForm.register('email')}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none ring-0 focus:border-cyan-500"
                  placeholder="name@example.com"
                />
                {loginForm.formState.errors.email ? <p className="mt-1 text-sm text-rose-300">{loginForm.formState.errors.email.message}</p> : null}
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-300">Password</label>
                <input
                  type="password"
                  {...loginForm.register('password')}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-cyan-500"
                  placeholder="Enter your password"
                />
                {loginForm.formState.errors.password ? <p className="mt-1 text-sm text-rose-300">{loginForm.formState.errors.password.message}</p> : null}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={registerForm.handleSubmit(handleRegister)}>
              <div>
                <label className="mb-1 block text-sm text-slate-300">Username</label>
                <input
                  type="text"
                  {...registerForm.register('username')}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-cyan-500"
                  placeholder="jdoe"
                />
                {registerForm.formState.errors.username ? <p className="mt-1 text-sm text-rose-300">{registerForm.formState.errors.username.message}</p> : null}
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-300">Full Name</label>
                <input
                  type="text"
                  {...registerForm.register('fullName')}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-cyan-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-300">Email</label>
                <input
                  type="email"
                  {...registerForm.register('email')}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-cyan-500"
                  placeholder="name@example.com"
                />
                {registerForm.formState.errors.email ? <p className="mt-1 text-sm text-rose-300">{registerForm.formState.errors.email.message}</p> : null}
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-300">Password</label>
                <input
                  type="password"
                  {...registerForm.register('password')}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-cyan-500"
                  placeholder="Create a strong password"
                />
                {registerForm.formState.errors.password ? <p className="mt-1 text-sm text-rose-300">{registerForm.formState.errors.password.message}</p> : null}
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-300">Role</label>
                <select
                  {...registerForm.register('role')}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-cyan-500"
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
