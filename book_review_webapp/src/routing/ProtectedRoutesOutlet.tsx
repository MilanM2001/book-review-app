import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { AppRoute } from './routesEnum';

const ProtectedRoutesOutlet: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>
    }

    if (!isAuthenticated) {
        return <Navigate to={AppRoute.LOGIN} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoutesOutlet;
