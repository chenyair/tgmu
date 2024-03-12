import request from 'supertest';
import initApp from '../app';
import mongoose from 'mongoose';
import { Express } from 'express';
import fs from 'fs';
import httpStatus from 'http-status';

let app: Express;

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
