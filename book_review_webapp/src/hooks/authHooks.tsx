import { useState } from "react";
import { getMe, login, refreshToken, register } from "../services/authService";
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
            const data = await login(loginData);
            const accessToken = data.accessToken;
            const refreshToken = data.refreshToken
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken)
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

const useRefreshToken = () => {
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const refreshTokenHandler = async () => {
        try {
            setIsLoading(true);
            const data = await refreshToken();
            const newAccessToken = data.accessToken;

            localStorage.setItem('accessToken', newAccessToken);
            return newAccessToken;
        } catch (error: any) {
            setError(error);
            console.error("Refresh token error:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return { refreshTokenHandler, loading, error };
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
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
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

const useGetMe = () => {
    const [error, setError] = useState(null)

    const getMeHandler = async () => {
        try {
            const res = await getMe()
            return res
        } catch (error: any) {
            setError(error)
            return null
        }
    }

    return { getMeHandler, error }
}

export { useLogin, useRefreshToken, useRegister, useLogout, useGetMe }