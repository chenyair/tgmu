import winston from 'winston';

const logFormat = winston.format.printf(
  ({ level, message, label = 'general', timestamp }) =>
    `${timestamp} [${label.toUpperCase()}] [${level.toUpperCase()}]: ${message}`
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  format: logFormat,
  defaultMeta: { service: 'backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/backend.log' }),
    new winston.transports.Console(),
  ],
});

// Export a function that receives a module name and returns a child logger for that module
export default (module: string) => logger.child({ label: module });
