import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Handle AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      details: err.details,
    });
  }

  // Handle Prisma errors
  if (err instanceof PrismaClientKnownRequestError) {
    return handlePrismaError(err, res);
  }

  // Handle unexpected errors
  console.error('Unexpected error:', err);
  return res.status(500).json({
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
  });
}

function handlePrismaError(err: PrismaClientKnownRequestError, res: Response) {
  switch (err.code) {
    case 'P2002':
      // Unique constraint violation
      return res.status(409).json({
        code: 'CONFLICT',
        message: 'A record with this value already exists',
        details: err.meta,
      });

    case 'P2025':
      // Record not found
      return res.status(404).json({
        code: 'NOT_FOUND',
        message: 'The requested record was not found',
        details: err.meta,
      });

    case 'P2003':
      // Foreign key constraint violation
      return res.status(400).json({
        code: 'BAD_REQUEST',
        message: 'Invalid reference to related record',
        details: err.meta,
      });

    default:
      // Other Prisma errors
      return res.status(500).json({
        code: 'DATABASE_ERROR',
        message: 'A database error occurred',
        details: err.meta,
      });
  }
}
