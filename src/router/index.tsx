import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import HomePage from '../pages/HomePage';
import StorePage from '../pages/StorePage';
import NotFoundPage from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      // Tienda routes with category
      {
        path: 'tienda',
        children: [
          {
            index: true,
            // Redirect /tienda to /tienda/rangos
            element: <Navigate to="/tienda/rangos" replace />,
          },
          {
            path: ':category',
            element: <StorePage />,
          },
        ],
      },
      // Legacy /store redirect
      {
        path: 'store',
        element: <Navigate to="/tienda" replace />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
