import { AppError } from '../utils/AppError.js';

export class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const errorHandler = (err, _req, res, _next) => {
  let statusCode = 500;
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
  }
  
  // Log full error for debugging
  console.error('Error Handler:', {
    message: err.message,
    statusCode,
    stack: err.stack,
    name: err.name,
    code: err.code
  });
  
  const payload = {
    message: err.message || 'Internal Server Error',
    ...(err instanceof ApiError && err.details ? { details: err.details } : {})
  };
  
  if (process.env.NODE_ENV !== 'production') {
    console.error('Full error:', err);
  }
  res.status(statusCode).json(payload);
};
