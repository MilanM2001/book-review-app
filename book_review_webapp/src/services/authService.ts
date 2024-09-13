import { LoginRequest, RefreshTokenRequest, RegisterRequest } from '../model/auth';
import api from './api';

const login = async (loginData: LoginRequest) => {
    try {
        const response = await api.post('/auth/login', loginData)
        return response.data
    } catch (error) {
        console.error("Login error:", error)
        throw error
    }
}

const refreshToken = async () => {
    try {
        const storedRefreshToken = localStorage.getItem("refreshToken");
        if (!storedRefreshToken) throw new Error("No refresh token found");

        let tokenData: RefreshTokenRequest = {
            refreshToken: storedRefreshToken
        }

        const response = await api.post('/auth/refresh', tokenData);
        return response.data;
    } catch (error) {
        console.error("Refresh token error:", error);
        throw error;
    }
}

const register = async (registerData: RegisterRequest) => {
    try {
        await api.post("/auth/register", registerData)
    } catch (error) {
        console.error("Register error:", error)
        throw error
    }
}

const getMe = async () => {
    try {
        const response = await api.get('/auth/getMe');
        return response.data
    } catch (error) {
        console.error("Error in retrieving user:", error)
        throw error
    }
};


export { login, refreshToken, register, getMe };