import { AxiosInstance } from 'axios';
import { createApiClient } from './api-client';
import { IUserDetails } from 'shared-types';
import { IUserFormInputProps } from '@/pages/profile';

export class UsersService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = createApiClient('/users');
  }

  async updateById(id: string, updatePayload: IUserFormInputProps, signal?: AbortSignal) {
    const formData = new FormData();

    // parse nested updatePayload to a flat formData
    for (const _key in updatePayload) {
      const typedKey = _key as keyof IUserFormInputProps;
      if (typedKey === 'image') {
        const { file } = updatePayload[typedKey];
        if (file) {
          formData.set('imageFile', file);
        }
      } else if (typedKey === 'changePassword') {
        const { currentPassword, newPassword } = updatePayload[typedKey];
        if (currentPassword && newPassword) {
          formData.set('currentPassword', currentPassword);
          formData.set('newPassword', newPassword);
        }
      } else {
        formData.set(typedKey, updatePayload[typedKey] as string);
      }
    }

    return (
      await this.apiClient.put<IUserDetails>(`/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        signal,
      })
    ).data;
  }
}

export const usersService = new UsersService();
