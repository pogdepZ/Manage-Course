import axios from 'axios';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '../utils/tokenManager';

const API_BASE_URL = 'http://localhost:3000/api';

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

let onAuthRefresh = () => {};

export function registerAuthRefreshHandler(handler) {
  onAuthRefresh = handler;
}

http.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('Missing refresh token');
      }

      const response = await axios.post(`${API_BASE_URL}/refresh`, { refreshToken });
      const newAccessToken = response.data?.data?.accessToken || response.data?.accessToken;
      const newRefreshToken = response.data?.data?.refreshToken || response.data?.refreshToken || refreshToken;

      if (!newAccessToken) {
        throw new Error('Invalid refresh response');
      }

      setTokens(newAccessToken, newRefreshToken);
      onAuthRefresh({ accessToken: newAccessToken, refreshToken: newRefreshToken });

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return http(originalRequest);
    } catch (refreshError) {
      clearTokens();
      onAuthRefresh(null);
      return Promise.reject(refreshError);
    }
  }
);
