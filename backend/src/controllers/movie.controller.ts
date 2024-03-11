import { AxiosInstance } from 'axios';
import { Movie } from 'shared-types';
import createApiAgent from 'utils/api.agent';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export class MovieController {
  private apiAgent: AxiosInstance;

  constructor() {
    this.apiAgent = createApiAgent({
      baseURL: 'https://api.themoviedb.org/3',
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    });
  }

  async getPopularMovies(_req: Request, res: Response) {
    const moviesResponse = await this.apiAgent.get<{ page: number; results: Movie[] }>(
      '/discover/movie?include_video=false&language=en-US&page=1&sort_by=popularity.desc'
    );

    res.status(httpStatus.OK).send(moviesResponse.data.results);
  }
}

export const movieController = new MovieController();
