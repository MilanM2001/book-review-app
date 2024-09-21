import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, CircularProgress, Box } from '@mui/material';
import { getMe } from '../services/authService'; // Make sure this is the correct import for your getMe function
import { UserResponse } from '../model/user';
import { useAuth } from '../services/authContext';
import "../css/MyAccount.css"

const MyAccount: React.FC = () => {
    const { role, isAuthenticated, error: authError } = useAuth();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const userData = await getMe();
                setUser(userData);
            } catch (err) {
                setError('Failed to load your information. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return (
            <Container className="myaccount-container">
                <Box className="loading-box">
                    <CircularProgress />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Loading your information...
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (error || authError) {
        return (
            <Container className="myaccount-container">
                <Paper className="error-paper">
                    <Typography variant="h6" color="error">
                        {error || authError}
                    </Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Container className="myaccount-container" maxWidth="sm">
            <Paper className="myaccount-paper" elevation={3}>
                <Typography variant="h4" align="center" gutterBottom>
                    My Account
                </Typography>
                {user && (
                    <Box>
                        <Typography variant="h6">
                            Username: <strong>{user.username}</strong>
                        </Typography>
                        <Typography variant="h6">
                            Email: <strong>{user.email}</strong>
                        </Typography>
                        <Typography variant="h6">
                            Role: <strong>{user.role}</strong>
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default MyAccount;
