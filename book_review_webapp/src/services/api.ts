import axios from "axios";
import { refreshToken } from "./authService";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach the access token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle 401 responses and automatically refresh the token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If response status is 401 (Unauthorized) and it's not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshTokenHandler(); // Call the refresh function

        // Update the original request with the new token and retry it
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // Retry the request with the new token
      } catch (err) {
        // If refreshing the token fails, reject the promise
        return Promise.reject(err);
      }
    }

    return Promise.reject(error); // If the response is not 401, reject the promise
  }
);

const refreshTokenHandler = async () => {
  try {
    const data = await refreshToken();
    const newAccessToken = data.accessToken;

    // Update localStorage with the new access token
    localStorage.setItem('accessToken', newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Refresh token error:", error);
    throw error;
  }
};

export default api;