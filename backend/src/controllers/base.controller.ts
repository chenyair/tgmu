import { Request, Response } from 'express';
import { FilterQuery, Model } from 'mongoose';
import { omit, pick } from 'lodash';

const logger = console; // TODO: replace with custom logger implementation

export class BaseController<ModelType> {
  private loggerPrefix: string;
  constructor(public model: Model<ModelType>) {
    this.loggerPrefix = `${model.name} (${model.db.name}.${model.collection.name}):`; // Ex. User (tgmu.users): ...
  }

  private debug(...msg: string[]) {
    logger.debug(`${this.loggerPrefix} ${msg.join(' ')}`);
  }

  private sanitizeObject(obj: object, ...exclude: string[]): FilterQuery<ModelType> | Partial<ModelType> {
    const allowed = pick(obj, Object.keys(this.model.schema.paths)) ?? {};

    const sanitized = omit(allowed, exclude);
    this.debug(`Sanitized: ${sanitized}`);
    return sanitized;
  }

  async get(req: Request, res: Response) {
    const query = this.sanitizeObject(req.query);
    this.debug(`Get`);
    const docs = await this.model.find(query);
    res.status(200).send(docs);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    this.debug(`Get by id ${id}`);
    const docs = await this.model.findById(id);
    res.status(200).send(docs);
  }

  async post(req: Request, res: Response) {
    this.debug(`Creating`); // Not logging body for security (passwords, private information etc...)
    const obj = await this.model.create(this.sanitizeObject(req.body));
    this.debug(`Created ${obj._id}`);
    res.status(201).send(obj);
  }

  putById(req: Request, res: Response) {
    const updateQuery = this.sanitizeObject(req.query);
    this.debug(`Updating by query ${updateQuery}`);
    const updatePayload = this.sanitizeObject(req.body, '_id');
    const doc = this.model.updateOne(updateQuery, updatePayload);
    res.status(201).send(doc);
  }

  deleteById(req: Request, res: Response) {
    const { id } = req.params;
    this.debug(`Delete by id ${id}`);
    const doc = this.model.deleteOne({ id });
    res.send(201).send(doc);
  }
}

const createController = <ModelType>(model: Model<ModelType>) => new BaseController<ModelType>(model);

export default createController;
