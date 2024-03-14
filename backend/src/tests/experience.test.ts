import ExperienceModel from '../models/experience.model';
import initApp from '../app';
import User from '../models/user.model';
import { Express } from 'express';
import httpStatus from 'http-status';
import { IComment, IExperience, IUser, NewExperience, PopulatedComment, MovieDetails } from 'shared-types';
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

const secondUserEmail = 'experience2@test.com';

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

const commentText = `This is a unique test comment ${new Date().getTime()}`;

let userId: Types.ObjectId;
let accessToken: string;
let firstExperiece: IExperience;
let createdFiles: string[] = [];

beforeAll(async () => {
  app = await initApp();
  await User.deleteMany({ email: user.email });
  await User.deleteMany({ email: secondUserEmail });
  const registerResponse = (await request(app).post('/auth/register').send(user)).body;
  accessToken = registerResponse.accessToken;
  userId = registerResponse._id;
}, 20000);

afterAll(async () => {
  await ExperienceModel.deleteMany({ userId });
  await User.deleteMany({ email: user.email });
  await User.deleteMany({ email: secondUserEmail });

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
      .post('/api/experiences')
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
      .get('/api/experiences?page=1&limit=1')
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
      .post('/api/experiences')
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
      .get('/api/experiences?page=2&limit=1')
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

  test('Add comment to experience', async () => {
    const response = await request(app)
      .post(`/api/experiences/${firstExperiece._id}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ text: commentText });
    expect(response.statusCode).toBe(httpStatus.CREATED);
    const createdComment = response.body.comments.find((comment: IComment) => comment.text === commentText)!;
    expect(createdComment).toBeDefined();
    expect(createdComment!.userId).toBe(userId.toString());
    firstExperiece.comments = [...firstExperiece.comments, createdComment];
  });

  test('Get experience by id', async () => {
    const response = await request(app)
      .get(`/api/experiences/${firstExperiece._id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(httpStatus.OK);
    expect(response.body).toBeDefined();
    expect(response.body._id).toMatch(firstExperiece._id!);

    const matchComment: PopulatedComment = response.body.comments.find(
      (comment: IComment) => comment.text === commentText
    );
    expect(matchComment).toBeDefined();
    expect(matchComment!.userId._id).toBe(userId.toString());
    expect(matchComment!.userId.imgUrl).toBe(user.imgUrl);
    expect(matchComment!.userId.firstName).toBe(user.firstName);
    expect(matchComment!.userId.lastName).toBe(user.lastName);
  });

  test('Update experience', async () => {
    const liked = [new Date().getTime()];
    const newTitle = 'New title';
    const newDescription = 'New description';
    const response = await request(app)
      .put(`/api/experiences/${firstExperiece._id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('experienceImage', path.resolve(__dirname, 'another.webp'))
      .field('title', newTitle)
      .field('description', newDescription)
      .field('likedUsers', liked.toString());
    expect(response.statusCode).toBe(httpStatus.CREATED);
    expect(response.body).toBeDefined();
    expect(response.body.title).toBe(newTitle);
    expect(response.body.description).toBe(newDescription);
    expect(response.body.imgUrl).toBeDefined();
    createdFiles = [...createdFiles, response.body.imgUrl];

    // Expect no change in comments and likes
    expect(response.body.comments).toMatchObject(firstExperiece.comments);
    expect(response.body.likedUsers).not.toContain(liked);
    expect(response.body.likedUsers).toMatchObject(firstExperiece.likedUsers);
  });

  describe('Delete experience tests', () => {
    let firstExperienceId: string;

    beforeEach(async () => {
      // Add experience before deletion
      firstNewExperience.userId = userId.toString();
      const response = await request(app)
        .post('/api/experiences')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('experienceImage', path.resolve(__dirname, 'test.png'))
        .field('title', firstNewExperience.title)
        .field('description', firstNewExperience.description)
        .field('userId', firstNewExperience.userId)
        .field('movieId', movieDetails.id)
        .field('moviePosterPath', movieDetails.poster_path)
        .field('movieTitle', movieDetails.title);

      firstExperienceId = response.body._id;
    });

    test('Delete experience', async () => {
      const response = await request(app)
        .delete(`/api/experiences/${firstExperienceId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(httpStatus.CREATED);
      expect(response.body).toBeDefined();
      expect(response.body._id).toBe(firstExperienceId);
    });

    test('delete experience that does not exist', async () => {
      await request(app).delete(`/api/experiences/${firstExperienceId}`).set('Authorization', `Bearer ${accessToken}`);
      const response = await request(app)
        .delete(`/api/experiences/${firstExperienceId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
    });

    test('delete experience that does not belong to the user', async () => {
      // Create new user
      const registerResponse = (
        await request(app)
          .post('/auth/register')
          .send({ ...user, email: secondUserEmail })
      ).body;
      const secondUserAccessToken = registerResponse.accessToken;

      const response = await request(app)
        .delete(`/api/experiences/${firstExperienceId}`)
        .set('Authorization', `Bearer ${secondUserAccessToken}`);
      expect(response.statusCode).toBe(httpStatus.UNAUTHORIZED);
    });
  });
});
