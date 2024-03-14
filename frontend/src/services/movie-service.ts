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

  async getByQuery(query: string, signal?: AbortSignal): Promise<Movie[]> {
    return (
      await this.apiClient.get<Movie[]>('/search', {
        params: { query },
        signal,
      })
    ).data;
  }
}

export const movieService = new MovieService();
