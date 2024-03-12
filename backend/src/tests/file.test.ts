import request from 'supertest';
import initApp from '../app';
import mongoose from 'mongoose';
import { Express } from 'express';
import fs from 'fs';
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
}, 20000);

afterAll(async () => {
  await mongoose.connection.close();
}, 20000);

describe('Statics file routing tests', () => {
  test('Get image from server', async () => {
    const response = await request(app).get('/public/test.png');
    const actualStaticFile = fs.readFileSync('public/test.png');

    expect(response.statusCode).toBe(httpStatus.OK);
    expect(actualStaticFile.equals(response.body));
  });
});
