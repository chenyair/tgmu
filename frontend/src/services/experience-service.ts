import { ExperienceGetAllResponse } from 'shared-types';
import { createApiClient } from './api-client';
import { AxiosInstance } from 'axios';

export class ExperienceService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = createApiClient('/experiences');
  }

  async getAll(page: number = 1, limit: number = 10, signal?: AbortSignal): Promise<ExperienceGetAllResponse> {
    return (
      await this.apiClient.get<ExperienceGetAllResponse>('', {
        params: {
          page,
          limit,
        },
        signal,
      })
    ).data;
  }
}

export const experienceService = new ExperienceService();
