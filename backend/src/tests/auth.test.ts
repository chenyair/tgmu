import request from 'supertest';
import initApp from '../app';
import mongoose from 'mongoose';
import { Express } from 'express';
import { IUser } from 'shared-types';
import User from '../models/user.model';
import httpStatus from 'http-status';

let app: Express;
const user: Partial<IUser> = {
  email: 'testUser@test.com',
  password: '1234567890',
  firstName: 'bob',
  lastName: 'thebuilder',
  age: 80,
  imgUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Bob_the_builder.jpg/220px-Bob_the_builder.jpg',
};

beforeAll(async () => {
  app = await initApp();
  await User.deleteMany({ email: user.email });
}, 20000);

afterAll(async () => {
  await mongoose.connection.close();
}, 20000);

let accessToken: string;
let refreshToken: string;
let newRefreshToken: string;

describe('Auth tests', () => {
  test('Test Register', async () => {
    const response = await request(app).post('/auth/register').send(user);
    expect(response.statusCode).toBe(httpStatus.CREATED);
  });

  test('Test Register exist email', async () => {
    const response = await request(app).post('/auth/register').send(user);
    expect(response.statusCode).toBe(httpStatus.NOT_ACCEPTABLE);
  });

  test('Test Register missing password', async () => {
    const response = await request(app).post('/auth/register').send({
      email: 'test@test.com',
    });
    expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
  });

  test('Test Login', async () => {
    const { email, password } = user;
    const response = await request(app).post('/auth/login').send({ email, password });
    expect(response.statusCode).toBe(httpStatus.OK);
    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  test('Test refresh token', async () => {
    const response = await request(app)
      .get('/auth/refresh')
      .set('Authorization', 'JWT ' + refreshToken)
      .send();
    expect(response.statusCode).toBe(httpStatus.OK);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();

    newRefreshToken = response.body.refreshToken;
  });

  test('Test double use of refresh token', async () => {
    const response = await request(app)
      .get('/auth/refresh')
      .set('Authorization', 'JWT ' + refreshToken)
      .send();
    expect(response.statusCode).not.toBe(httpStatus.OK);

    //verify that the new token is not valid as well
    const response1 = await request(app)
      .get('/auth/refresh')
      .set('Authorization', 'JWT ' + newRefreshToken)
      .send();
    expect(response1.statusCode).not.toBe(httpStatus.OK);
  });
});
