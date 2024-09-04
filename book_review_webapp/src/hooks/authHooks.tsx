import { useState } from "react";
import { login, register } from "../services/authService";
import { LoginRequest, RegisterRequest } from "../model/auth";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const loginHandler = async (loginData: LoginRequest) => {
        try {
            setIsLoading(true);
            const res = await login(loginData);
            const token = res.data;
            localStorage.setItem('accessToken', token);
            navigate("/")
        } catch (error: any) {
            if (error.response && (error.response.status === 403 || error.response.status === 401)) {
                setErrorMessage('Username or Password incorrect');
            }
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { loginHandler, loading, error, errorMessage };
};

const useRegister = () => {
    const [loading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    const registerHandler = async (registerData: RegisterRequest) => {
        try {
            setIsLoading(true)
            await register(registerData)
            navigate("/login")
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                setErrorMessage("Username taken")
            }
            setError(error)
        } finally {
            setIsLoading(false)
        }
    }

    return { registerHandler, loading, error, errorMessage }
}

const useLogout = () => {
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const logoutHandler = async () => {
        try {
            setIsLoading(true);
            localStorage.clear()
        } catch (error: any) {
            setError(error);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { logoutHandler, loading, error };
};

export { useLogin, useRegister, useLogout }