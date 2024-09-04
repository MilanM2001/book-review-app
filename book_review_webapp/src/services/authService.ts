import { LoginRequest, RegisterRequest } from '../model/auth';
import api from './api';

const login = async (loginData: LoginRequest) => {
    try {
        const response = await api.post('/auth/login', loginData)
        return response

    } catch (error) {
        console.error("Login error:", error)
        throw error
    }
}

const register = async (registerData: RegisterRequest) => {
    try {
        const response = await api.post("/auth/register", registerData)
        return response
    } catch (error) {
        console.error("Register error:", error)
        throw error
    }
}

// const getMe = async () => {
//   const response = await api.get('/auth/me');
//   return response.data;
// };

const logout = async () => {
    try {
        localStorage.remove('accessToken')
    } catch (error) {
        console.error("Logout error:", error)
        throw error
    }
};

export { login, register, logout };