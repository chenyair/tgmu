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
 *         - birthdate
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
 *         birthdate:
 *           type: Date
 *           description: The user's birthdate
 *         imgUrl:
 *           type: url
 *           description: The URL of the user's image
 *       example:
 *         email: 'bob@gmail.com'
 *         firstName: 'bob'
 *         lastName: 'thebuilder'
 *         date: 2000-09-19T00:00:00.000Z
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
 *     summary: Registers a new user
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
 *       BAD_REQUEST:
 *         description: Missing email or password
 *       NOT_ACCEPTABLE:
 *         description: Provided email already already is registered
 *       CREATED:
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
 *     summary: Signs in a user with google sign in
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
 *       BAD_REQUEST:
 *         description: Invalid credentials or google app permissions
 *       OK:
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
 *     summary: Performs a user login, creates JWT tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCredentials'
 *     responses:
 *       BAD_REQUEST:
 *         description: Missing email or password
 *       UNAUTHORIZED:
 *         description: Email or password incorrect
 *       OK:
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
 *     summary: Logout a user
 *     tags: [Auth]
 *     description: Required to provide the refresh token in the auth header
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       UNAUTHORIZED:
 *         description: No refresh token / Invalid refresh token provided
 *       OK:
 *         description: Logout completed successfully
 */
router.get('/logout', authController.logout);

/** [Refresh]
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: Logout A User
 *     tags: [Auth]
 *     description: Required to provide the refresh token in the auth header
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       UNAUTHORIZED:
 *         description: No refresh token / invalid refresh token provided
 *       OK:
 *         description: Successfully created new tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 */
router.get('/refresh', authController.refresh);

export default router;
