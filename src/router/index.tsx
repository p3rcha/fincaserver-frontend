import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import HomePage from '../pages/HomePage';
import StorePage from '../pages/StorePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'store',
        element: <StorePage />,
      },
    ],
  },
]);

