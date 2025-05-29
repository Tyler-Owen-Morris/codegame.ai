import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Dashboard from './Dashboard';
import Login from './Login';
import QRLogin from './QRLogin';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: '/dashboard',
                element: <Dashboard />,
            },
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/qr-login',
                element: <QRLogin />,
            },
        ],
    },
]);

export default router; 