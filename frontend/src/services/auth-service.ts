import { IUserDetails, UserTokens } from 'shared-types';
import axios, { AxiosInstance } from 'axios';

export class AuthenticationService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({ baseURL: `http://localhost:8000/auth` });
  }

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

  async register(newUser: IUserDetails & { password: string }): Promise<UserTokens> {
    return (
      await this.apiClient.post<UserTokens>('/register', newUser, {
        headers: { 'Content-Type': 'application/json' },
      })
    ).data;
  }

  async googleSignIn(credential: string): Promise<UserTokens> {
    return (
      await this.apiClient.post<UserTokens>(
        '/google',
        { credential: credential },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
    ).data;
  }

  async logout(refreshToken: string): Promise<void> {
    return this.apiClient.get('/logout', {
      headers: { Authorization: `Bearer ${refreshToken}`, 'Content-Type': 'application/json' },
    });
  }
}

export const authenticationService = new AuthenticationService();
