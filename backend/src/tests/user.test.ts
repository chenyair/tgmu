import request from 'supertest';
import initApp from '../app';
import mongoose from 'mongoose';
import { Express } from 'express';
import { IUser } from 'shared-types';
import User from '../models/user.model';
import httpStatus from 'http-status';
import { ObjectId } from 'mongodb';

let app: Express;
const user: Partial<IUser> = {
  email: 'user@test.com',
  password: '1234567890',
  firstName: 'user',
  lastName: 'test',
  birthdate: new Date('2000-09-19'),
  imgUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Bob_the_builder.jpg/220px-Bob_the_builder.jpg',
};

let userId: string;
let accessToken: string;

beforeAll(async () => {
  app = await initApp();
  await User.deleteMany({ email: user.email });
  const response = await request(app).post('/auth/register').send(user);
  userId = response.body._id;
  accessToken = response.body.accessToken;
}, 20000);

afterAll(async () => {
  await mongoose.connection.close();
}, 20000);

describe('User tests', () => {
  test('Get All Users', async () => {
    const response = await request(app).get('/users/').set('Authorization', `JWT ${accessToken}`);
    expect(response.statusCode).toBe(httpStatus.OK);
    expect(response.body).toBeDefined();
    const matchUser = response.body.find((u: IUser) => u._id === userId);

    expect(matchUser).toBeDefined();

    const allUsers = await User.find();
    expect(response.body.length).toBe(allUsers.length);
  });

  test('Get User by ID', async () => {
    const response = await request(app).get(`/users/${userId}`).set('Authorization', `JWT ${accessToken}`);
    expect(response.statusCode).toBe(httpStatus.OK);
    expect(response.body).toBeDefined();
  });

  test('Update user details by ID', async () => {
    const response = await request(app)
      .put(`/users/${userId}`)
      .set('Authorization', `JWT ${accessToken}`)
      .send({
        birthdate: new Date('1990-09-19'),
      });
    expect(response.statusCode).toBe(httpStatus.CREATED);
    expect(response.body).toBeDefined();
    expect(response.body.birthdate).toBe(new Date('1990-09-19').toISOString());

    const user = await User.findById(userId);
    expect(user?.birthdate.toISOString()).toBe(new Date('1990-09-19').toISOString());
  });

  test('Update other user details', async () => {
    const response = await request(app)
      .put(`/users/${new ObjectId()}`)
      .set('Authorization', `JWT ${accessToken}`)
      .send({
        birthdate: new Date('1990-09-19'),
      });
    expect(response.statusCode).toBe(httpStatus.UNAUTHORIZED);
  });

  test('Delete other user', async () => {
    const response = await request(app).delete(`/users/${new ObjectId()}`).set('Authorization', `JWT ${accessToken}`);
    expect(response.statusCode).toBe(httpStatus.UNAUTHORIZED);
  });

  // TODO: add tests for non existing users after adding error handling
  // test('Update non existing user', async () => {
  //   const response = await request(app).put(`/users/${new ObjectId()}`).send({
  //     age: 30,
  //   });
  //   expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
  // });

  test('Delete user by ID', async () => {
    const response = await request(app).delete(`/users/${userId}`).set('Authorization', `JWT ${accessToken}`);
    expect(response.statusCode).toBe(httpStatus.CREATED);
    expect(response.body).toBeDefined();
    const user = await User.findById(userId);
    expect(user).toBeNull();
  });
});
