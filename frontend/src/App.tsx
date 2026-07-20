import { Navigate, Route, Routes } from 'react-router-dom';
import { useAppSelector } from './hooks/useAppDispatch';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProjectsPage from './pages/projects/ProjectsPage';
import ProjectDetailPage from './pages/projects/ProjectDetailPage';
import ProjectFormPage from './pages/projects/ProjectFormPage';
import TasksPage from './pages/tasks/TasksPage';
import TaskDetailPage from './pages/tasks/TaskDetailPage';
import NotificationsPage from './pages/notifications/NotificationsPage';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = useAppSelector(s => s.auth.token);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
        <Route index                      element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard"          element={<DashboardPage />} />
        <Route path="/projects"           element={<ProjectsPage />} />
        <Route path="/projects/new"       element={<ProjectFormPage />} />
        <Route path="/projects/:id"       element={<ProjectDetailPage />} />
        <Route path="/projects/:id/edit"  element={<ProjectFormPage />} />
        <Route path="/tasks"              element={<TasksPage />} />
        <Route path="/tasks/:id"          element={<TaskDetailPage />} />
        <Route path="/notifications"      element={<NotificationsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
