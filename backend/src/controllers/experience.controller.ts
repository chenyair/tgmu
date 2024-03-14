import { ExperienceGetAllResponse, IExperience } from 'shared-types';
import { BaseController } from './base.controller';
import ExperienceModel from '../models/experience.model';
import { Request, Response } from 'express';
import { AuthRequest } from 'common/auth.middleware';
import httpStatus from 'http-status';

class ExperienceController extends BaseController<IExperience> {
  constructor() {
    super(ExperienceModel);
  }
  
  async post(req: Request, res: Response) {
    const newBody = req.body as IExperience;
    if (req.file?.path) {
      newBody.imgUrl = req.file.path;
    }
    
    const { movieId, moviePosterPath, movieTitle } = req.body;
    newBody.movieDetails = {
      id: movieId,
      poster_path: moviePosterPath,
      title: movieTitle,
    };

    req.body = newBody;
    return super.post(req, res);
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

  async deleteById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const doc = await this.model.findById(id);

    if (!doc) {
      return res.status(httpStatus.NOT_FOUND).send('Document not found');
    }

    if (req.user?._id !== doc.userId.toString()) {
      return res.status(httpStatus.UNAUTHORIZED).send('Unauthorized to perform actions on other user');
    }

    return super.deleteById(req, res);
  }
  
}

export const experienceController = new ExperienceController();
