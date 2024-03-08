import { UserTokens } from 'shared-types';
import apiClient from './api-client';

export class AuthenticationService {
  endpoint: string = '/auth';

  async login(email: string, password: string, signal?: AbortSignal): Promise<UserTokens> {
    return (
      await apiClient.post<UserTokens>(
        `${this.endpoint}/login`,
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
      await apiClient.get<UserTokens>(`${this.endpoint}/refresh`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${refreshToken}` },
        signal,
      })
    ).data;
  }
}

export const authenticationService = new AuthenticationService();
