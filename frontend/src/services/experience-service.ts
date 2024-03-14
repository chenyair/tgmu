import { ExperienceGetAllResponse, ExperienceGetByIdResponse, IExperience, NewExperience } from 'shared-types';
import { createApiClient } from './api-client';
import { AxiosInstance } from 'axios';

export class ExperienceService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = createApiClient('/experiences');
  }

  async getAll(
    { page = 1, limit = 1, owner }: { owner?: string; page: number; limit: number },
    signal?: AbortSignal
  ): Promise<ExperienceGetAllResponse> {
    return (
      await this.apiClient.get<ExperienceGetAllResponse>('', {
        params: {
          page,
          limit,
          owner,
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

  async updateById(id: string, experience: NewExperience): Promise<IExperience> {
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
      await this.apiClient.put<IExperience>(`/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    ).data;
  }

  async delete(experienceId: string): Promise<IExperience> {
    return (await this.apiClient.delete(`/${experienceId}`)).data;
  }
}

export const experienceService = new ExperienceService();
