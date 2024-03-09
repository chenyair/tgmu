import axios, { AxiosInstance } from 'axios';
import { authenticationService } from './auth-service';
import { writeTokens } from '@/utils/local-storage';

export const createApiClient = (endpoint: string = ''): AxiosInstance => {
  const apiClient = axios.create({ baseURL: `http://localhost:8000${endpoint}` });

  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');

      if (token && !config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      return config;
    },
    async (error) => Promise.reject(error)
  );

  // TODO: Handle multiple requests trying to refresh token at once
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (axios.isAxiosError(error) && error.config) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (error.response?.status === 403 && error.response?.data === 'jwt expired' && refreshToken) {
          const tokens = await authenticationService.refreshAccessToken(refreshToken);
          error.config.headers.Authorization = `Bearer ${tokens.accessToken}`;

          // Save new tokens
          writeTokens(tokens);

          // Retry request with newly fetched token
          return apiClient(error.config);
        }
      }

      return Promise.reject(error);
    }
  );

  return apiClient;
};
