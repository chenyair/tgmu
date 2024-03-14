import express from 'express';
import { experienceController } from '../controllers/experience.controller';
const router = express.Router();
import saveFileMiddleware from '../common/file.middleware';
import 'express-async-errors';

/** [Swagger Tag]
 * @swagger
 * tags:
 *   name: Experience
 *   description: Requests related to Experiences
 */

/** [Swagger Schemas]
/**
 * @swagger
 * components:
 *   schemas:
 *     MovieDetails:
 *       type: object
 *       required:
 *         - id 
 *         - title
 *         - poster_path
 *       properties:
 *         id:
 *           type: integer
 *           description: The movie's id
 *         title:
 *           type: string
 *           description: The movie's title
 *         poster_path:
 *           type: string
 *           description: The movie's poster path
 * 
 *     Comment:
 *       type: object
 *       required:
 *         - text
 *         - userId
 *       properties:
 *         text:
 *           type: string
 *           description: The comment's text
 *         userId:
 *           type: string
 *           description: The comment's userId
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The comments's creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The comment's last update date
 * 
 *     BaseExperience:
 *       type: object
 *       required:
 *         - userId
 *         - title
 *         - description
 *         - imgUrl
 *       properties:
 *         userId:
 *           type: string
 *           description: The experience's userId
 *         title:
 *           type: string
 *           description: The experience's title
 *         description:
 *           type: string
 *           description: The experience's description
 *         imgUrl:
 *           type: string
 *           description: The experience's image URL
 *       example:
 *         userId: '90101234'
 *         title: 'Bob the builder experience'
 *         description: 'That was the best movie ever'
 *         imgUrl: '/bob_the_builder.png'
 * 
 *     Experience:
 *       required:
 *         - _id
 *         - likedUsers
 *         - comments
 *         - createdAt
 *         - movieDetails
 *       allOf:
 *         - type: object
 *           properties:
 *             _id: 
 *               type: string
 *               description: The experience's id
 *             likedUsers:
 *               type: array
 *               items:
 *                 type: string
 *             comments:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *             movieDetails:
 *               $ref: '#/components/schemas/MovieDetails'
 *             createdAt:
 *               type: string
 *               format: date-time
 *               description: The experience's creation date
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               description: The experience's last update date
 *         - $ref: '#/components/schemas/BaseExperience'
 *       example:
 *         _id: '9999'
 *         userId: '90101234'
 *         title: 'Bob the builder experience'
 *         description: 'That was the best movie ever'
 *         comments: 
 *           - {text: 'I agree', userId: '1234', createdAt: '2021-01-02T00:00:00.000Z', updatedAt: '2021-01-02T00:00:00.000Z'} 
 *           - {text: 'I disagree', userId: '5678', createdAt: '2021-01-03T00:00:00.000Z', updatedAt: '2021-01-03T00:00:00.000Z'}
 *         likedUsers: ['1234']
 *         imgUrl: '/bob_the_builder.png'
 *         movieDetails: {id: 1234, title: 'Bob the builder', poster_path: '/bob_the_builder.png'}
 *         createdAt: '2021-01-01T00:00:00.000Z'
 *         updatedAt: '2021-01-01T00:00:00.000Z'
 * 
 */

/**
 * @swagger
 * /experiences:
 *   get:
 *     tags:
 *       - Experience
 *     description: Get all experiences
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number to retrieve experiences. Each page contains 10 experiences by default.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The amount of experiences per page
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Experience'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('', experienceController.getAll.bind(experienceController));

/**
 * @swagger
 * /experiences/{id}:
 *   get:
 *     tags:
 *       - Experience
 *     description: Get experience by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The experience's _id
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Experience'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/:id', experienceController.getById.bind(experienceController));

/**
 * @swagger
 * /experiences:
 *   post:
 *     tags:
 *       - Experience
 *     description: Create a new experience
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BaseExperience'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Experience'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('', saveFileMiddleware.single('experienceImage'), experienceController.post.bind(experienceController));

/** [DELETE EXPERIENCE]
 * @swagger
 * /experience/{id}:
 *   delete:
 *     tags: [Experience]
 *     summary: Deletes an experience by id
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *         description: The experience's _id
 *         example: 1234-abcd-5678-efgh
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       OK:
 *         description: Deleted experience successfully
 *       UNAUTHORIZED:
 *         description: No token provided, or attempted to delete a different user's experience
 *       INTERNAL_SERVER_ERROR:
 *         description: Internal server error
 */
router.delete('/:id', experienceController.deleteById.bind(experienceController));

/**
 * @swagger
 * /experiences/{id}/comment:
 *   post:
 *     tags:
 *       - Experience
 *     description: Add a new comment to an experience
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: The comment's text
 *             example:
 *               text: 'Wow, looks amazing!'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Experience'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/:id/comments', experienceController.addComment.bind(experienceController));

/** [TOGGLE LIKE]
 * @swagger
 * /experiences/{id}/like:
 *   post:
 *     tags: [Experience]
 *     summary: Toggles a like on an experience
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The experience's _id
 *           example: 1234-abcd-5678-efgh
 *     requestBody:
 *       default: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             schema:
 *               type: object
 *               required:
 *                 - like
 *               properties:
 *                 like:
 *                   type: boolean
 *                   description: Whether to like or unlike the experience
 *           example:
 *              like: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       OK:
 *         description: Toggled like successfully
 *       UNAUTHORIZED:
 *         description: No token provided
 *       INTERNAL_SERVER_ERROR:
 *         description: Internal server error
 */
router.post('/:id/like', experienceController.toggleLike.bind(experienceController));

export default router;
