import { Express } from 'express';
import createLogger from 'utils/logger';
import initApp from 'app';
import http from 'http';
import https from 'https';
import fs from 'fs';

const logger = createLogger('Express');
const ENV = process.env.NODE_ENV!;

initApp().then((app: Express) => {
  logger.debug(`Running in ${ENV}`);

  const port = process.env.PORT || 8000;
  if (ENV !== 'production') {
    http.createServer(app).listen(port);
  } else {
    const httpsConf = {
      key: fs.readFileSync('../client-key.pem'),
      cert: fs.readFileSync('../client-cert.pem'),
    };
    https.createServer(httpsConf, app).listen(port);
  }
  logger.debug(`The Ger Movie Universe API is running on port ${port}`);
});
