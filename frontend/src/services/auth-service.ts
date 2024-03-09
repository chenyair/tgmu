import { UserTokens } from 'shared-types';
import { createApiClient } from './api-client';
import { AxiosInstance } from 'axios';

export class AuthenticationService {
  apiClient: AxiosInstance = createApiClient('/auth');

  async login(email: string, password: string, signal?: AbortSignal): Promise<UserTokens> {
    return (
      await this.apiClient.post<UserTokens>(
        '/login',
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' },
          signal,
        }
      )
    ).data;
  }

  async refreshAccessToken(refreshToken: string, signal?: AbortSignal): Promise<UserTokens> {
    return (
      await this.apiClient.get<UserTokens>('/refresh', {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${refreshToken}` },
        signal,
      })
    ).data;
  }
}

export const authenticationService = new AuthenticationService();
