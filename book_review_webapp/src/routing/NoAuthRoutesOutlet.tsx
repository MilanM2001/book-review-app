import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../services/authContext';

const NoAuthRoutesOutlet: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return <Outlet />;
};

export default NoAuthRoutesOutlet;
