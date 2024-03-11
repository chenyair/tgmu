import UserModel from 'models/user.model';
import initApp from 'app';
import User from 'models/user.model';
import { Express } from 'express';
import httpStatus from 'http-status';
import { IUser } from 'shared-types';
import request from 'supertest';

let app: Express;
const user: Partial<IUser> = {
  email: 'movie@test.com',
  password: '1234567890',
  firstName: 'movie',
  lastName: 'test',
  birthdate: new Date('2000-09-19'),
  imgUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Bob_the_builder.jpg/220px-Bob_the_builder.jpg',
};

let userId: string;
let accessToken: string;

beforeAll(async () => {
  app = await initApp();
  await User.deleteMany({ email: user.email });
  const registerResponse = (await request(app).post('/auth/register').send(user)).body;
  accessToken = registerResponse.accessToken;
}, 20000);

afterAll(async () => {
  await UserModel.findByIdAndDelete(userId);
}, 20000);

describe('Movie tests', () => {
  test('Get popular movies', async () => {
    const response = await request(app).get('/movies/popular').set('Authorization', `JWT ${accessToken}`);
    expect(response.statusCode).toBe(httpStatus.OK);
    expect(response.body).toBeDefined();
    const movies = response.body;

    expect(movies.length).toBeGreaterThan(0);

    // Check that the first item in the results array has properties that a movie should have
    const firstMovie = movies[0];
    expect(firstMovie).toHaveProperty('id');
    expect(firstMovie).toHaveProperty('title');
  }, 5000);
});
