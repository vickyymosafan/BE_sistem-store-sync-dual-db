import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(422).json({
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: formatZodErrors(result.error),
      });
    }

    req.body = result.data;
    next();
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return res.status(422).json({
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: formatZodErrors(result.error),
      });
    }

    // Use Object.assign to avoid Express 5 read-only property error
    Object.assign(req.query, result.data);
    next();
  };
}

export function validateParams(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return res.status(422).json({
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: formatZodErrors(result.error),
      });
    }

    // Use Object.assign to avoid Express 5 read-only property error
    Object.assign(req.params, result.data);
    next();
  };
}

function formatZodErrors(error: ZodError) {
  return error.issues.map((err) => ({
    path: err.path.join('.'),
    message: err.message,
  }));
}
