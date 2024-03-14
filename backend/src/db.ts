import env from 'dotenv';
import mongoose from 'mongoose';
import createLogger from './utils/logger';

env.config();
const logger = createLogger('db');

const { DB_URL, DB_USER, DB_PASSWORD } = process.env as Record<string, string>;

const initDB = async (): Promise<mongoose.mongo.Db> => {
  const url = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URL}`;

  logger.debug(`Connecting to ${process.env.NODE_ENV} DB at ${DB_USER}@${DB_URL}`);

  mongoose.connection.on('error', (err) => logger.error(err));
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
  const dbClient = connection.getClient();
  dbClient.addListener('commandStarted', (event) => logger.debug(JSON.stringify(event)));
  dbClient.addListener('commandSucceeded', (event) => logger.debug(JSON.stringify(event)));
  dbClient.addListener('commandFailed', (event) => logger.error(JSON.stringify(event)));
  return connection.db;
};

export default initDB;
