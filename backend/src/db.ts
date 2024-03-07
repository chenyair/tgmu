import env from 'dotenv';
import mongoose from 'mongoose';
import createLogger from './utils/logger';

env.config();
const logger = createLogger('db');

const { DB_URL, DB_USER, DB_PASSWORD } = process.env as Record<string, string>;

const initDB = async (): Promise<mongoose.mongo.Db> => {
  const url = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URL}`;

  logger.debug(`Connecting to ${process.env.NODE_ENV} DB at ${DB_USER}@${DB_URL}`);

  mongoose.connection.on('error', logger.error);
  const { connection } = await mongoose.connect(url, {
    monitorCommands: true,
    retryWrites: true,
    writeConcern: {
      w: 'majority',
    },
  });

  logger.debug(`Successfully connected to ${process.env.NODE_ENV} DB`);

  // Attach log listener to every client event
  // see https://www.mongodb.com/docs/drivers/node/current/fundamentals/logging/
  ['Started', 'Succeeded', 'Failed'].forEach((action) =>
    connection.getClient().addListener(`command${action}`, (event) => logger.debug(JSON.stringify(event)))
  );
  return connection.db;
};

export default initDB;