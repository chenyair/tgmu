import request from 'supertest';
import initApp from '../app';
import mongoose from 'mongoose';
import { Express } from 'express';
import User from '../models/user.model';
import httpStatus from 'http-status';
import { IUser } from 'shared-types';

let app: Express;
const user: Partial<IUser> = {
  email: 'testUser@test.com',
  password: '1234567890',
  firstName: 'bob',
  lastName: 'thebuilder',
  birthdate: new Date('2000-09-19'),
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

  test('Test auth status without JWT', async () => {
    const response = await request(app).get('/auth/status').send();
    expect(response.statusCode).toBe(httpStatus.UNAUTHORIZED);
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

  test('Test auth status with valid token', async () => {
    const response = await request(app)
      .get('/auth/status')
      .set('Authorization', 'JWT ' + accessToken)
      .send();
    expect(response.statusCode).toBe(httpStatus.OK);
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

  test('Test auth with expired token', async () => {
    const response = await request(app)
      .get('/auth/status')
      .set('Authorization', 'JWT ' + refreshToken) // send refresh token as valid JWT but invalid access token
      .send();

    expect(response.statusCode).toBe(httpStatus.UNAUTHORIZED);
  });
});
