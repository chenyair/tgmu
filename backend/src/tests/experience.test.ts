import ExperienceModel from '../models/experience.model';
import initApp from '../app';
import User from '../models/user.model';
import { Express } from 'express';
import httpStatus from 'http-status';
import { IExperience, IUser, MovieDetails, NewExperience } from 'shared-types';
import request from 'supertest';
import { Types } from 'mongoose';
import path from 'path';
import fs from 'fs';

let app: Express;
const user: Partial<IUser> = {
  email: 'experience@test.com',
  password: '1234567890',
  firstName: 'experience',
  lastName: 'test',
  birthdate: new Date('2000-09-19'),
  imgUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Bob_the_builder.jpg/220px-Bob_the_builder.jpg',
};

const movieDetails: MovieDetails = {
  id: 1,
  title: 'test movie',
  poster_path: 'test path',
};

const firstNewExperience: Partial<NewExperience> & { description: string; title: string } = {
  description: 'This is the first test experience',
  title: 'Test experience',
};

const secondNewExperience: Partial<NewExperience> & { description: string; title: string } = {
  description: 'This is the second test experience',
  title: 'Test experience',
};

let userId: Types.ObjectId;
let accessToken: string;
let firstExperiece: IExperience;
let createdFiles: string[] = [];

beforeAll(async () => {
  app = await initApp();
  await User.deleteMany({ email: user.email });
  const registerResponse = (await request(app).post('/auth/register').send(user)).body;
  accessToken = registerResponse.accessToken;
  userId = registerResponse._id;
}, 20000);

afterAll(async () => {
  await ExperienceModel.deleteMany({ userId });

  // Delete all created files
  createdFiles
    .map((file) => path.resolve(__dirname, '../../', file))
    .forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
}, 20000);

describe('Experience tests', () => {
  test('Create new experience', async () => {
    firstNewExperience.userId = userId.toString();
    const response = await request(app)
      .post('/experiences')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('experienceImage', path.resolve(__dirname, 'test.png'))
      .field('title', firstNewExperience.title)
      .field('description', firstNewExperience.description)
      .field('userId', firstNewExperience.userId)
      .field('movieId', movieDetails.id)
      .field('moviePosterPath', movieDetails.poster_path)
      .field('movieTitle', movieDetails.title);

    expect(response.statusCode).toBe(httpStatus.CREATED);
    expect(response.body).toBeDefined();

    firstExperiece = response.body;

    expect(firstExperiece._id).toBeDefined();
    expect(firstExperiece.title).toBe(firstNewExperience.title);
    expect(firstExperiece.description).toBe(firstNewExperience.description);
    expect(firstExperiece.imgUrl).toBeDefined();
    createdFiles = [...createdFiles, firstExperiece.imgUrl];
    expect(firstExperiece.userId).toBe(userId.toString());
    expect(firstExperiece.movieDetails).toMatchObject(movieDetails);
  });

  test('Get all experiences first page', async () => {
    const response = await request(app)
      .get('/experiences?page=1&limit=1')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(httpStatus.OK);
    expect(response.body).toBeDefined();

    const experiencesGetAll = response.body;
    expect(experiencesGetAll.currentPage).toBe(1);
    expect(experiencesGetAll.experiences).toBeDefined();
    expect(experiencesGetAll.experiences.length).toBe(1);
    expect(experiencesGetAll.experiences[0]._id).toBe(firstExperiece._id);
  });

  test('Get all experiences second page', async () => {
    // Enter second experience to db
    secondNewExperience.userId = userId.toString();
    const secondExperienceResponse = await request(app)
      .post('/experiences')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('experienceImage', path.resolve(__dirname, 'test.png'))
      .field('title', secondNewExperience.title)
      .field('description', secondNewExperience.description)
      .field('userId', secondNewExperience.userId.toString())
      .field('movieId', movieDetails.id)
      .field('moviePosterPath', movieDetails.poster_path)
      .field('movieTitle', movieDetails.title);

    const secondExperience = secondExperienceResponse.body;
    createdFiles = [...createdFiles, secondExperience.imgUrl];

    const secondPageResponse = await request(app)
      .get('/experiences?page=2&limit=1')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(secondPageResponse.statusCode).toBe(httpStatus.OK);
    expect(secondPageResponse.body).toBeDefined();

    const secondPageGetAll = secondPageResponse.body;
    expect(secondPageGetAll.currentPage).toBe(2);
    expect(secondPageGetAll.experiences).toBeDefined();
    expect(secondPageGetAll.experiences.length).toBe(1);

    // The new experience should be in the first page cause its the newest so the preivous
    // experience should be the first in the second page
    expect(secondPageGetAll.experiences[0]._id).not.toBe(secondExperience._id);
    expect(secondPageGetAll.experiences[0]).toMatchObject(firstExperiece);
  });
});
