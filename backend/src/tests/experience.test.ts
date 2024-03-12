import ExperienceModel from 'models/experience.model';
import initApp from 'app';
import User from 'models/user.model';
import { Express } from 'express';
import httpStatus from 'http-status';
import { IUser, NewExperience } from 'shared-types';
import request from 'supertest';

let app: Express;
const user: Partial<IUser> = {
  email: 'experience@test.com',
  password: '1234567890',
  firstName: 'experience',
  lastName: 'test',
  birthdate: new Date('2000-09-19'),
  imgUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Bob_the_builder.jpg/220px-Bob_the_builder.jpg',
};

const firstNewExperience: Partial<NewExperience> = {
  description: 'This is the second test experience',
  imgUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Bob_the_builder.jpg/220px-Bob_the_builder.jpg',
  title: 'Test experience',
};

const secondNewExperience: Partial<NewExperience> = {
  description: 'This is the second test experience',
  imgUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Bob_the_builder.jpg/220px-Bob_the_builder.jpg',
  title: 'Test experience',
};

let userId: string;
let accessToken: string;

beforeAll(async () => {
  app = await initApp();
  await User.deleteMany({ email: user.email });
  const registerResponse = (await request(app).post('/auth/register').send(user)).body;
  accessToken = registerResponse.accessToken;
  userId = registerResponse._id;
}, 20000);

afterAll(async () => {
  await ExperienceModel.deleteMany({ userId });
}, 20000);

describe('Experience tests', () => {
  test('Create new experience', async () => {
    const response = await request(app)
      .post('/experiences')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(firstNewExperience);
    expect(response.statusCode).toBe(httpStatus.CREATED);
    expect(response.body).toBeDefined();
    const newExperience = response.body;

    expect(newExperience._id).toBeDefined();
    expect(newExperience).toMatchObject(firstNewExperience);
  }, 5000);

  test('Get all experiences', async () => {
    const response = await request(app)
      .post('/experiences')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(firstNewExperience);
    expect(response.statusCode).toBe(httpStatus.CREATED);
    expect(response.body).toBeDefined();
    const newExperience = response.body;

    expect(newExperience._id).toBeDefined();
    expect(newExperience).toMatchObject(firstNewExperience);
  }, 5000);

  // TODO: add more test and handle file uploadj
});
