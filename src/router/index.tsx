import { createBrowserRouter } from 'react-router-dom';
import ComingSoonPage from '../pages/ComingSoonPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ComingSoonPage />,
  },
  {
    path: '*',
    element: <ComingSoonPage />,
  },
]);
