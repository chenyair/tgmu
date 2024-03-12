import { ExperienceGetAllResponse, IExperience } from 'shared-types';
import { BaseController } from './base.controller';
import ExperienceModel from '../models/experience.model';
import { Request, Response } from 'express';

class ExperienceController extends BaseController<IExperience> {
  constructor() {
    super(ExperienceModel);
  }

  async getAll(
    req: Request<
      Record<string, never>,
      ExperienceGetAllResponse,
      Record<string, never>,
      { page: string; limit: string }
    >,
    res: Response
  ) {
    const { page = '1', limit = '10' } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const skip = (pageNumber - 1) * limitNumber;
    const totalDocsCount = await this.model.countDocuments();
    const currentPageDocs = await this.model.find().sort({ createdAt: -1 }).skip(skip).limit(limitNumber);
    res.status(200).send({
      experiences: currentPageDocs,
      totalPages: Math.ceil(totalDocsCount / limitNumber),
      currentPage: pageNumber,
    });
  }
}

export const experienceController = new ExperienceController();
