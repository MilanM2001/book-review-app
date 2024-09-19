import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../services/authService';

interface AuthContextProps {
    role: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    login: (accessToken: string, refreshToken: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [role, setRole] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Move the fetchUser function outside useEffect so that it can be used elsewhere
    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const userData = await getMe();
                setRole(userData.role);
                setIsAuthenticated(true);
            }
        } catch (err: any) {
            console.error('Error fetching user:', err);
            setError('Failed to fetch user');
            setIsAuthenticated(false);
            setRole(null);
        } finally {
            setLoading(false);
        }
    };

    // Use fetchUser in useEffect to run on component mount
    useEffect(() => {
        fetchUser();
    }, []);

    // Use fetchUser in the login function as well
    const login = async (accessToken: string, refreshToken: string) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setIsAuthenticated(true);
        await fetchUser(); // Fetch user details after login
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.clear();
        setIsAuthenticated(false);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ role, isAuthenticated, loading, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
