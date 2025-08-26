import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  if (error.name === 'ValidationError') {
    sendError(res, error.message, 400);
    return;
  }

  if (error.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid token', 401);
    return;
  }

  if (error.name === 'TokenExpiredError') {
    sendError(res, 'Token expired', 401);
    return;
  }

  if (error.code === 'P2002') {
    sendError(res, 'Data already exists', 409);
    return;
  }

  if (error.code === 'P2025') {
    sendError(res, 'Record not found', 404);
    return;
  }

  sendError(res, 'Internal server error', 500, error.message);
};

export const notFound = (req: Request, res: Response): void => {
  sendError(res, `Route ${req.originalUrl} not found`, 404);
};