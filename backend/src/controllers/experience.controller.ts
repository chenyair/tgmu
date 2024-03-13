import { ExperienceGetAllResponse, ExperienceGetByIdResponse, IComment, IExperience } from 'shared-types';
import { BaseController } from './base.controller';
import ExperienceModel from '../models/experience.model';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { AuthRequest } from 'common/auth.middleware';

class ExperienceController extends BaseController<IExperience> {
  constructor() {
    super(ExperienceModel);
  }
  async post(req: Request, res: Response) {
    const body = req.body as IExperience;
    if (req.file?.path) {
      body.imgUrl = req.file.path;
    }
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

  async getById(req: Request, res: Response): Promise<Response<ExperienceGetByIdResponse>> {
    const { id } = req.params;
    this.debug(`Get by id ${id}`);
    const doc = await this.model.findById(id).populate('comments.userId', 'firstName lastName imgUrl'); // Populates the comments with the user who made them
    return res.status(httpStatus.OK).send(doc);
  }

  async addComment(req: AuthRequest<{ id: string }, ExperienceGetByIdResponse, { text: string }>, res: Response) {
    const { id: experienceId } = req.params;
    const { text } = req.body;
    const { _id: userId } = req.user!;

    const doc = await this.model.findById(experienceId);
    if (!doc) {
      return res.status(httpStatus.NOT_FOUND).send('Experience not found');
    }
    doc.comments.push({ userId: userId!, text } as IComment);
    await doc.save();
    return res.status(httpStatus.CREATED).send(doc);
  }
}

export const experienceController = new ExperienceController();
