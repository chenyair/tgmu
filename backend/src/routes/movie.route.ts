import express from 'express';
const router = express.Router();
import { movieController } from 'controllers/movie.controller';

/** [Swagger Tag]
 * @swagger
 * tags:
 *   name: Movie
 *   description: Requests related to movies
 */

/** [Swagger Schemas]
/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       required:
 *         - adult
 *         - backdrop_path
 *         - genre_ids
 *         - id
 *         - original_language
 *         - original_title
 *         - overview
 *         - popularity
 *         - poster_path
 *         - release_date
 *         - title
 *         - video
 *         - vote_average
 *         - vote_count
 *       properties:
 *         adult:
 *           type: boolean
 *           description: Indicates if the movie is for adults
 *         backdrop_path:
 *           type: string
 *           description: The path to the backdrop image
 *         genre_ids:
 *           type: array
 *           items:
 *             type: number
 *           description: The ids of the genres the movie belongs to
 *         id:
 *           type: number
 *           description: The id of the movie
 *         original_language:
 *           type: string
 *           description: The original language of the movie
 *         original_title:
 *           type: string
 *           description: The original title of the movie
 *         overview:
 *           type: string
 *           description: The overview of the movie
 *         popularity:
 *           type: number
 *           description: The popularity of the movie
 *         poster_path:
 *           type: string
 *           description: The path to the poster image
 *         release_date:
 *           type: string
 *           format: date
 *           description: The release date of the movie
 *         title:
 *           type: string
 *           description: The title of the movie
 *         video:
 *           type: boolean
 *           description: Indicates if the movie has a video
 *         vote_average:
 *           type: number
 *           description: The average vote of the movie
 *         vote_count:
 *           type: number
 *           description: The vote count of the movie
 */

/** [Register]
 * @swagger
 * /movies/popular:
 *   get:
 *     tags:
 *       - Movie
 *     description: Get all popular movies
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
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
router.get('/popular', movieController.getPopularMovies.bind(movieController));

export default router;
