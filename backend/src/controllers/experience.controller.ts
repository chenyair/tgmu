import { ExperienceGetAllResponse, ExperienceGetByIdResponse, IComment, IExperience } from 'shared-types';
import { BaseController } from './base.controller';
import ExperienceModel from '../models/experience.model';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { AuthRequest } from '../common/auth.middleware';

class ExperienceController extends BaseController<IExperience> {
  constructor() {
    super(ExperienceModel);
  }

  async post(req: Request, res: Response) {
    const newBody = req.body as IExperience;
    if (req.file?.path) {
      newBody.imgUrl = req.file.path.replace(/\\/g, '/');
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
      { page: string; limit: string; owner?: string }
    >,
    res: Response
  ) {
    const { page = '1', limit = '10', owner } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const skip = (pageNumber - 1) * limitNumber;
    const dbQuery = owner ? { userId: owner } : {};
    const totalDocsCount = await this.model.countDocuments(dbQuery);
    const currentPageDocs = await this.model.find(dbQuery).sort({ createdAt: -1 }).skip(skip).limit(limitNumber);
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

  async toggleLike(req: AuthRequest<{ id: string }, ExperienceGetByIdResponse, { like: boolean }>, res: Response) {
    const { id: experienceId } = req.params;
    const { _id: userId } = req.user!;
    const { like } = req.body;

    const doc = await this.model.findById(experienceId);
    if (!doc) {
      return res.status(httpStatus.NOT_FOUND).send('Experience not found');
    }

    const withOutUser = doc.likedUsers.filter((id) => id.toString() !== userId);

    doc.likedUsers = like ? [...withOutUser, userId!] : withOutUser;

    await doc.save();
    return res.status(httpStatus.CREATED).send(doc);
  }
}

export const experienceController = new ExperienceController();
