import express from 'express';
const router = express.Router();
import UserController from '../controllers/user.controller';

/** [Swagger Tag]
 * @swagger
 * tags:
 *   name: User
 *   description: Requests related to users
 */

/** [Swagger Schemas]
 * @swagger
 * components:
 *   schemas:
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
 */

/** [Get All Users]
 * @swagger
 * /users:
 *   get:
 *     summary: Returns all users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       OK:
 *         description: The list of users
 *         content:
 *         application/json:
 *         schema:
 *           type: array
 *           items:
 *           $ref: '#/components/schemas/UserDetails'
 *       UNAUTHORIZED:
 *           description: No refresh token / invalid refresh token provided
 *       INTERNAL_SERVER_ERROR:
 */
router.get('/', UserController.get);

/** [Get User by ID]
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [User]
 *     summary: Returns user details by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The user's _id
 *           example: 1234-abcd-5678-efgh
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       OK:
 *         description: The list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserDetails'
 *       UNAUTHORIZED:
 *           description: No refresh token / invalid refresh token provided
 *       INTERNAL_SERVER_ERROR:
 */
router.get('/', UserController.getById);

/** [UPDATE USER]
 * @swagger
 * /users/{id}:
 *   put:
 *     tags: [User]
 *     summary: Updates a user by id
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *         description: The user's _id
 *         example: 1234-abcd-5678-efgh
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *              - $ref: '#/components/schemas/UserDetails'
 *              - $ref: '#/components/schemas/UserCredentials'
 *     responses:
 *       OK:
 *         description: Updated user successfully. returns updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDetails'
 *       UNAUTHORIZED:
 *         description: No token provided, attempt to update other user
 *       INTERNAL_SERVER_ERROR:
 *         description: Internal server error
 */
router.put('/:id', UserController.putById);

/** [DELETE USER]
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags: [User]
 *     summary: Deletes a user by id
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *         description: The user's _id
 *         example: 1234-abcd-5678-efgh
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       OK:
 *         description: Deleted user successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDetails'
 *       UNAUTHORIZED:
 *         description: No token provided, attempt to delete other user
 *       INTERNAL_SERVER_ERROR:
 *         description: Internal server error
 */
router.delete('/:id', UserController.deleteById);
