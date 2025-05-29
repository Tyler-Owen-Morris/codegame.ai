import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Dashboard from './Dashboard';
import Splash from './Splash';
import QRLogin from './QRLogin';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Splash />,
            },
            {
                path: '/dashboard',
                element: <Dashboard />,
            },
            {
                path: '/splash',
                element: <Splash />,
            },
            {
                path: '/qr-login',
                element: <QRLogin />,
            },
        ],
    },
]);

export default router; 