import { ErrorCode } from '../constants';

import type { ErrorRequestHandler } from 'express';
import type { ZodIssue } from 'zod';

type CustomError = {
  error_code: keyof typeof ErrorCode;
  error_description: string;
  status: number;
  issues?: ZodIssue[];
};

export const genCustomError = (
  code: CustomError['error_code'],
  description?: string,
  status?: number,
  issues?: CustomError['issues']
): CustomError => {
  return {
    error_code: code,
    error_description: description ?? 'Ocorreu um erro não identificado.',
    status: status ?? 400,
    issues,
  };
};
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.status && err.error_code && err.error_description) {
    const { status, error_code, error_description, issues } = err;
    res.status(status).send({ error_code, error_description, issues });
  } else {
    console.error(`> [Internal Error](${new Date().toISOString()})`, err);
    res.status(500);
    res.json({ error: ErrorCode.INTERNAL_SERVER_ERROR });
  }
};
