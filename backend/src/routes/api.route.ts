import express from 'express';
const router = express.Router();
import userRoute from './user.route';
import movieRoute from './movie.route';
import experienceRoute from './experience.route';
import authMiddleware from '../common/auth.middleware';
import 'express-async-errors';

router.use(authMiddleware);
router.use('/users', userRoute);
router.use('/movies', movieRoute);
router.use('/experiences', experienceRoute);

export default router;
