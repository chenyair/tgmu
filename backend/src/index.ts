import { Express } from 'express';
import createLogger from './utils/logger';
import initApp from './app';
import http from 'http';
import https from 'https';
import fs from 'fs';

const logger = createLogger('Express');
const { NODE_ENV: ENV, LISTEN_ADDRESS } = process.env as Record<string, string>;

const SERVER_PROTOCOL = ENV === 'production' ? 'https' : 'http';

const PORT = process.env.PORT || ENV === 'production' ? '443' : '80'

export const SERVER_URL = `${SERVER_PROTOCOL}://${LISTEN_ADDRESS}:${PORT}`;

initApp().then((app: Express) => {
  logger.debug(`Running in ${ENV}`);

  const port = PORT || 8000;
  if (ENV !== 'production') {
    http.createServer(app).listen(PORT);
  } else {
    const httpsConf = {
      key: fs.readFileSync(`${__dirname}/../client-key.pem`),
      cert: fs.readFileSync(`${__dirname}/../client-cert.pem`),
    };
    https.createServer(httpsConf, app).listen(port);
  }
  logger.debug(`The Ger Movie Universe API is listnening on ${SERVER_URL}`);
});
