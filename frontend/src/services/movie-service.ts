import { Movie } from 'shared-types';
import { createApiClient } from './api-client';
import { AxiosInstance } from 'axios';

export class MovieService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = createApiClient('/movies');
  }

  async getPopular(signal?: AbortSignal): Promise<Movie[]> {
    return (
      await this.apiClient.get<Movie[]>('/popular', {
        signal,
      })
    ).data;
  }
}

export const movieService = new MovieService();
