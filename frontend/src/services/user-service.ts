import { AxiosInstance } from 'axios';
import { createApiClient } from './api-client';
import { IUserDetails, IUserUpdatePayload } from 'shared-types';

export class UsersService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = createApiClient('/users');
  }

  async updateById(id: string, updatePayload: IUserUpdatePayload, signal?: AbortSignal) {
    return (
      await this.apiClient.put<IUserDetails>(`/${id}`, updatePayload, {
        headers: { 'Content-Type': 'application/json' },
        signal,
      })
    ).data;
  }
}

export const usersService = new UsersService();
