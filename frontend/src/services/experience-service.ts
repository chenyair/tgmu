import { ExperienceGetAllResponse, ExperienceGetByIdResponse, IExperience } from 'shared-types';
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

  async getById(id: string, signal?: AbortSignal): Promise<ExperienceGetByIdResponse> {
    return (
      await this.apiClient.get<ExperienceGetByIdResponse>(`/${id}`, {
        signal,
      })
    ).data;
  }

  async postComment(experienceId: string, text: string, signal?: AbortSignal): Promise<IExperience> {
    return (await this.apiClient.post<IExperience>(`/${experienceId}/comments`, { text }, { signal })).data;
  }
}

export const experienceService = new ExperienceService();
