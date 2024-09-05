import { Container, Box, CircularProgress, Typography, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import { useGetMe } from "../hooks/authHooks"
import "../css/MyAccount.css"

const MyAccount = () => {
    const { getMeHandler, error } = useGetMe();
    const [user, setUser] = useState<{ username: string; email: string; role: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const fetchedUser = await getMeHandler();
            if (fetchedUser) {
                setUser(fetchedUser);
            }
            setLoading(false);
        };
        fetchUser()

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

    if (error) {
        return (
            <Container className="myaccount-container">
                <Paper className="error-paper">
                    <Typography variant="h6" color="error">
                        Failed to load your information. Please try again.
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
