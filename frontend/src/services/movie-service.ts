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
    if (query === '') return [];
    return [
      {
        adult: false,
        backdrop_path: '/gJL5kp5FMopB2sN4WZYnNT5uO0u.jpg',
        genre_ids: [28, 12, 16, 35, 10751],
        id: 1011985,
        original_language: 'en',
        original_title: 'Kung Fu Panda 4',
        overview:
          'Po is gearing up to become the spiritual leader of his Valley of Peace, but also needs someone to take his place as Dragon Warrior. As such, he will train a new kung fu practitioner for the spot and will encounter a villain called the Chameleon who conjures villains from the past.',
        popularity: 1652.671,
        poster_path: '/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
        release_date: '2024-03-02',
        title: 'Kung Fu Panda 4',
        video: false,
        vote_average: 6.993,
        vote_count: 68,
      },
      {
        adult: false,
        backdrop_path: '/mDeUmPe4MF35WWlAqj4QFX5UauJ.jpg',
        genre_ids: [28, 27, 53],
        id: 1096197,
        original_language: 'pt',
        original_title: 'No Way Up',
        overview:
          "Characters from different backgrounds are thrown together when the plane they're travelling on crashes into the Pacific Ocean. A nightmare fight for survival ensues with the air supply running out and dangers creeping in from all sides.",
        popularity: 1425.033,
        poster_path: '/hu40Uxp9WtpL34jv3zyWLb5zEVY.jpg',
        release_date: '2024-01-18',
        title: 'No Way Up',
        video: false,
        vote_average: 6.007,
        vote_count: 203,
      },
    ].filter((movie) => movie.title.toLowerCase().includes(query.toLowerCase()));
    return (
      await this.apiClient.get<Movie[]>('/search', {
        params: { query },
        signal,
      })
    ).data;
  }
}

export const movieService = new MovieService();
