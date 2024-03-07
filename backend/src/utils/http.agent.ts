import createLogger from 'utils/logger';
import axios, { AxiosInstance, AxiosError, CreateAxiosDefaults, AxiosResponse, AxiosRequestConfig } from 'axios';
import { UUID, randomUUID } from 'crypto';

const logger = createLogger('HTTP_AGENT');

type AxiosRequestConfigWithId = AxiosRequestConfig & {
  reqId?: UUID;
};

const createAxiosInstance = (options: CreateAxiosDefaults = {}): AxiosInstance => {
  const instance = axios.create({
    timeout: 5000,
    ...options,
  });

  // Set up a default request interceptor
  instance.interceptors.request.use((config) => {
    const requestUUID = randomUUID();
    const { method, url, headers } = config;
    const contentLength = headers['Content-Length'] || 0;
    logger.debug(`Starting Request ${requestUUID} - ${method} ${url} ${contentLength}b`);
    return {
      ...config,
      reqId: requestUUID,
    };
  });

  // Set up a default response and error interceptors
  instance.interceptors.response.use(
    // Response Interceptor
    (response: AxiosResponse) => {
      // Log successful responses
      const requestConfig = response.request.config as AxiosRequestConfigWithId;
      const requestUUID = requestConfig?.reqId ?? '';
      logger.debug(`Response for ${requestUUID} - status: ${response.status}`);

      return response;
    },
    (error: AxiosError) => {
      // Handle your error here
      if (error.response) {
        // The request was made, and the server responded with a status code
        logger.error('Response error:', error.response.status, error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        logger.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        logger.error('Request setup error:', error.message);
      }

      // Return a rejected promise with the error
      return Promise.reject(error);
    }
  );

  return instance;
};

export default createAxiosInstance;
