import { IExperience } from 'shared-types';
import { BaseController } from './base.controller';
import ExperienceModel from '../models/experience.model';
import { Request, Response } from 'express';

class ExperienceController extends BaseController<IExperience> {
  constructor() {
    super(ExperienceModel);
  }

  async getAll(
    req: Request<Record<string, never>, Record<string, never>, Record<string, never>, { page: number; limit: number }>,
    res: Response
  ) {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const docs = await this.model.find().sort().skip(skip).limit(limit);
    res.status(200).send(docs);
  }
}

export const experienceController = new ExperienceController();
