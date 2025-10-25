import logger from '../config/logger.js';

export class APIError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  logger.error({
    message: err.message,
    statusCode: err.statusCode,
    url: req.originalUrl,
    method: req.method,
  });

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).json({
      success: false,
      message: err.isOperational ? err.message : 'Something went wrong',
    });
  }
};

export const notFound = (req, res, next) => {
  const err = new APIError('Route not found', 404);
  next(err);
};

export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default errorHandler;
