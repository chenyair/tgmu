import express from 'express';
const router = express.Router();
import * as authController from '../controllers/auth.controller';

/** [Swagger Tag]
 * @swagger
 * tags:
 *   name: Auth
 *   description: The Authentication API
 */

/** [Swagger Schemas]
 * @swagger
 * components:
 *   schemas:
 *     UserCredentials:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *       example:
 *         email: 'bob@gmail.com'
 *         password: '123456'
 *
 *     UserDetails:
 *       type: object
 *       required:
 *         - email
 *         - firstName
 *         - lastName
 *         - age
 *         - imgUrl
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email
 *         firstName:
 *           type: string
 *           description: The user's first name
 *         lastName:
 *           type: string
 *           description: The user's last name
 *         age:
 *           type: number
 *           description: The user's age
 *           min: 0
 *         imgUrl:
 *           type: url
 *           description: The URL of the user's image
 *       example:
 *         email: 'bob@gmail.com'
 *         firstName: 'bob'
 *         lastName: 'thebuilder'
 *         age: 80
 *         imgUrl: 'www.images.com/bob/the/builder.png'
 *
 *     Tokens:
 *       type: object
 *       required:
 *         - accessToken
 *         - refreshToken
 *       properties:
 *         accessToken:
 *           type: string
 *           description: The JWT access token
 *         refreshToken:
 *           type: string
 *           description: The JWT refresh token
 *       example:
 *         accessToken: '123cd123x1xx1'
 *         refreshToken: '134r2134cr1x3c'
 */

/** [Register]
 * @swagger
 * /auth/register:
 *   post:
 *     summary: registers a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/UserCredentials'
 *               - $ref: '#/components/schemas/UserDetails'
 *     responses:
 *       200:
 *         description: The new user
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Tokens'
 *                 - type: object
 *                   required:
 *                     - _id
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The new user's _id
 *                   example:
 *                     _id: 1234-abcd-5678-efgh
 */
router.post('/register', authController.register);

/** [Google]
 * @swagger
 * /auth/google:
 *   post:
 *     summary: signs in a user with google sign in
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - credentials
 *             properties:
 *               credentials:
 *                 type: string
 *             example:
 *               credentials: fhsd7nf78yno24nfoagh87wyn4f
 *     responses:
 *       200:
 *         description: The new user
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Tokens'
 *                 - type: object
 *                   required:
 *                     - _id
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The new user's _id
 *                   example:
 *                     _id: 1234-abcd-5678-efgh
 */
router.post('/google', authController.googleSignIn);

/** [Login]
 * @swagger
 * /auth/login:
 *   post:
 *     summary: performs a user login, creates JWT tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCredentials'
 *     responses:
 *       200:
 *         description: The access & refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 */
router.post('/login', authController.login);

/** [Logout]
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: logout a user
 *     tags: [Auth]
 *     description: required to provide the refresh token in the auth header
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: logout completed successfully
 */
router.get('/logout', authController.logout);
router.get('/refresh', authController.refresh);

export default router;
