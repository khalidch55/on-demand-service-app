import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';
import { env } from '../config/env';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};