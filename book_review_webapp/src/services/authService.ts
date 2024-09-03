import api from './api';

const login = async (username: string, password: string) => {
    try {
        var loginData = { username, password }
        const response = await api.post('/auth/login', loginData)
        return response.data
    } catch (error) {
        console.error("Login error:", error)
        throw error
    }
};

// const getMe = async () => {
//   const response = await api.get('/auth/me');
//   return response.data;
// };

const logout = async () => {
    try {
        await api.post('/auth/logout')
        localStorage.remove('token')
    } catch (error) {
        console.error("Logout error:", error)
        throw error
    }
};

export { login, logout };