import { useState } from "react";
import { login, logout } from "../services/authService";

const useLogin = () => {
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    // const navigate = useNavigate();

    const loginHandler = async (username: string, password: string) => {
        try {
            setIsLoading(true);
            const res = await login(username, password);
            localStorage.set('accessToken', res);
            console.log("USPEO")
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                setErrorMessage('Username or Password incorrect');
            }
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { loginHandler, loading, error, errorMessage };
};

const useLogout = () => {
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const logoutHandler = async () => {
        try {
            setIsLoading(true);
            await logout();
            localStorage.remove("accessToken");
        } catch (error: any) {
            setError(error);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { logoutHandler, loading, error };
};

export { useLogin, useLogout }