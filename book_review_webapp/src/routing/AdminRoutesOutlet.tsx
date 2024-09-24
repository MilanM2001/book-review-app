import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { AppRoute } from './routesEnum';

const AdminRoutesOutlet: React.FC = () => {
    const { role, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (role !== 'admin') {
        return <Navigate to={AppRoute.HOME} replace />;
    }

    return <Outlet />;
};

export default AdminRoutesOutlet;
