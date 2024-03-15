import express from 'express';
const router = express.Router();
import UserController from '../controllers/user.controller';
import saveFileMiddleware from '../common/file.middleware';
import 'express-async-errors';

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
 *           type: date
 *           description: The user's age
 *           min: 0
 *         imgUrl:
 *           type: url
 *           description: The URL of the user's image
 *       example:
 *         email: 'bob@gmail.com'
 *         firstName: 'bob'
 *         lastName: 'thebuilder'
 *         birthdate: 2022-01-01
 *         imgUrl: 'www.images.com/bob/the/builder.png'
 */

/** [Get All Users]
 * @swagger
 * /api/users:
 *   get:
 *     summary: Returns all users
 *     tags: [User]
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
 *         description: No refresh token / invalid refresh token provided
 *       INTERNAL_SERVER_ERROR:
 *         description: Internal server error
 */
router.get('/', UserController.get.bind(UserController));

/** [Get User by ID]
 * @swagger
 * /api/users/{id}:
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
 *         description: No refresh token / invalid refresh token provided
 *       INTERNAL_SERVER_ERROR:
 *         description: Internal server error
 */
router.get('/:id', UserController.getById.bind(UserController));

/** [UPDATE USER]
 * @swagger
 * /api/users/{id}:
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
 *               - $ref: '#/components/schemas/UserDetails'
 *               - type: object
 *                 properties:
 *                   currentPassword:
 *                     type: string
 *                   newPassword:
 *                     type: string
 *                   imageFile:
 *                     type: file
 *                     description: The user's image file
 *                 example:
 *                   email: 'bob@gmail.com'
 *                   firstName: 'bob'
 *                   lastName: 'thebuilder'
 *                   birthdate: 2022-01-0180
 *                   imageFile: <FileData>
 *                   imgUrl: 'www.images.com/bob/the/builder.png'
 *                   currentPassword: '123'
 *                   newPassword: '456'
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
router.put('/:id', saveFileMiddleware.single('imageFile'), UserController.putById.bind(UserController));

/** [DELETE USER]
 * @swagger
 * /api/users/{id}:
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
router.delete('/:id', UserController.deleteById.bind(UserController));

export default router;
