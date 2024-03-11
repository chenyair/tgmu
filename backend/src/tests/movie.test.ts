import initApp from 'app';
import { Express } from 'express';
import httpStatus from 'http-status';
import request from 'supertest';

let app: Express;

beforeAll(async () => {
  app = await initApp();
}, 20000);

describe('Movie tests', () => {
  test('Get popular movies', async () => {
    const response = await request(app).get('/movies/popular');
    expect(response.statusCode).toBe(httpStatus.OK);
    expect(response.body).toBeDefined();
    const movies = response.body;

    expect(movies.length).toBeGreaterThan(0);

    // Check that the first item in the results array has properties that a movie should have
    const firstMovie = movies[0];
    expect(firstMovie).toHaveProperty('id');
    expect(firstMovie).toHaveProperty('title');
  });
});
