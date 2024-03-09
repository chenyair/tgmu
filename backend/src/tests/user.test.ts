import request from 'supertest';
import initApp from '../app';
import mongoose from 'mongoose';
import { Express } from 'express';
import { IUser } from 'shared-types';
import User from '../models/user.model';
import httpStatus from 'http-status';

let app: Express;
const user: Partial<IUser> = {
  email: 'user@test.com',
  password: '1234567890',
  firstName: 'user',
  lastName: 'test',
  age: 20,
  imgUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Bob_the_builder.jpg/220px-Bob_the_builder.jpg',
};

let userId: string;

beforeAll(async () => {
  app = await initApp();
  userId = (await User.create(user)).id;
}, 20000);

afterAll(async () => {
  await mongoose.connection.close();
}, 20000);

describe('User tests', () => {
  test('Get All Users', async () => {
    const response = await request(app).get('/users/');
    expect(response.statusCode).toBe(httpStatus.OK);
    expect(response.body).toBeDefined();
    const matchUser = response.body.find((u: IUser) => u._id === userId);

    expect(matchUser).toBeDefined();

    const allUsers = await User.find();
    expect(response.body.length).toBe(allUsers.length);
  });

  test('Get User by ID', async () => {
    const response = await request(app).get(`/users/${userId}`);
    expect(response.statusCode).toBe(httpStatus.OK);
    expect(response.body).toBeDefined();
  });

  test('Update user details by ID', async () => {
    const response = await request(app).put(`/users/${userId}`).send({
      age: 30,
    });
    expect(response.statusCode).toBe(httpStatus.CREATED);
    expect(response.body).toBeDefined();
    expect(response.body.age).toBe(30);

    const user = await User.findById(userId);
    expect(user?.age).toBe(30);
  });

  test('Delete user by ID', async () => {
    const response = await request(app).delete(`/users/${userId}`);
    expect(response.statusCode).toBe(httpStatus.CREATED);
    expect(response.body).toBeDefined();
    const user = await User.findById(userId);
    expect(user).toBeNull();
  });
});
