import { ExperienceGetAllResponse, IExperience, NewExperience } from 'shared-types';
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

  async create(experience: NewExperience): Promise<IExperience> {
    const formData = new FormData();

    // parse nested experience to a flat formData
    for (const _key in experience) {
      const typedKey = _key as keyof NewExperience;
      if (typedKey === 'movieDetails') {
        const { id, poster_path, title } = experience[typedKey];
        formData.set('movieId', id.toString());
        formData.set('moviePosterPath', poster_path);
        formData.set('movieTitle', title);
      } else {
        formData.set(typedKey, experience[typedKey] as string);
      }
    }

    return (
      await this.apiClient.post<IExperience>('', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    ).data;
  }

  async delete(experienceId: string): Promise<IExperience> {
    return (await this.apiClient.delete(`/${experienceId}`)).data;
  }
}

export const experienceService = new ExperienceService();
