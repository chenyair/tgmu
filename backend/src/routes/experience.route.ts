import express from 'express';
import { experienceController } from '../controllers/experiences.controller';
const router = express.Router();

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
 * 
 *     Experience:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - comments
 *         - likedUsers
 *         - imgUrl
 *         - createdAt
 *       properties:
 *         _id: 
 *           type: string
 *           description: The experience's id
 *         title:
 *           type: string
 *           description: The experience's title
 *         description:
 *           type: string
 *           description: The experience's description
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *           description: The experience's comments
 *         likedUsers:
 *           type: array
 *           items:
 *             type: string
 *           description: The experience's liked users
 *         imgUrl:
 *           type: string
 *           description: The experience's image URL
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The experience's creation date
 *       example:
 *         _id: '9999'
 *         title: 'Bob the builder experience'
 *         description: 'That was the best movie ever'
 *         comments: [{text: 'I agree', userId: '1234'}, {text: 'I disagree', userId: '5678'}]
 *         likedUsers: ['1234']
 *         imgUrl: '/bob_the_builder.png'
 *         createdAt: '2021-01-01T00:00:00.000Z'
 * 
 */

/**
 * @swagger
 * /experiences:
 *   get:
 *     tags:
 *       - Experience
 *     description: Get all experiences
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number to retrieve experiences. Each page contains 10 experiences.
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

export default router;
