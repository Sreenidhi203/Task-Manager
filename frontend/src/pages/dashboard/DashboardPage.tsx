import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

const stats = [
  { label: 'Total Projects', value: '18', tone: 'text-cyan-300' },
  { label: 'Total Tasks', value: '64', tone: 'text-violet-300' },
  { label: 'Completed Tasks', value: '41', tone: 'text-emerald-300' },
  { label: 'Pending Tasks', value: '17', tone: 'text-amber-300' },
  { label: 'Overdue Tasks', value: '6', tone: 'text-rose-300' },
  { label: 'Notifications', value: '12', tone: 'text-sky-300' },
];

const activity = [
  { title: 'Quarterly planning review', time: '10 min ago', detail: 'Updated milestone ownership for the rollout' },
  { title: 'Security audit assigned', time: '32 min ago', detail: 'New tasks were distributed to the engineering team' },
  { title: 'Client feedback triaged', time: '1 hr ago', detail: 'Priority issues were flagged for immediate follow-up' },
];

const notifications = [
  { title: 'New comment on onboarding tasks', meta: '3 unread' },
  { title: 'Deadline approaching', meta: '2 due today' },
  { title: 'Project owner changed', meta: '1 update' },
];

export function DashboardPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_30%),linear-gradient(135deg,#020617,#111827)] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">Operations Dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Welcome back, {user?.username ?? 'there'}.</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
                Track delivery health, act on urgent work, and keep stakeholders aligned in a single view.
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Logout
            </Button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className={`mt-3 text-3xl font-semibold ${stat.tone}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Activity</h2>
                <span className="text-sm text-slate-400">Live feed</span>
              </div>
              <div className="mt-6 space-y-4">
                {activity.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-slate-200">{item.title}</p>
                      <span className="text-xs text-slate-500">{item.time}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Notifications</h2>
                  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">Updated</span>
                </div>
                <div className="mt-5 space-y-3">
                  {notifications.map((item) => (
                    <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                      <p className="text-sm font-medium text-slate-200">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{item.meta}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
                <h2 className="text-lg font-semibold">Team Snapshot</h2>
                <div className="mt-5 space-y-3 text-sm text-slate-400">
                  <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                    <span>Active projects</span>
                    <span className="font-semibold text-slate-200">14</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                    <span>Open blockers</span>
                    <span className="font-semibold text-amber-300">3</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                    <span>Launch readiness</span>
                    <span className="font-semibold text-emerald-300">92%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
