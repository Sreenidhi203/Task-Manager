import { Navigate, RouteObject } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/" replace />,
      },
    ],
  },
];
