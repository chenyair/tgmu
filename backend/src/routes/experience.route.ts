import express from 'express';
const router = express.Router();
import { experienceController } from '../controllers/experiences.controller';

router.get('', experienceController.getAll.bind(experienceController));

export default router;
