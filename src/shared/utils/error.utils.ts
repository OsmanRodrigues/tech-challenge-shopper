import type { ErrorRequestHandler } from 'express';
import { ErrorCode } from '../constants';

type CustomError = {
  error_code: keyof typeof ErrorCode;
  error_description: string;
  status: number;
};

export const genCustomError = (
  code: CustomError['error_code'],
  description?: string,
  status?: number
): CustomError => {
  return {
    error_code: code,
    error_description: description ?? 'Ocorreu um erro não identificado.',
    status: status ?? 400,
  };
};
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.status && err.error_code && err.error_description) {
    const { status, error_code, error_description } = err;
    res.status(status).send({ error_code, error_description });
  } else {
    console.error(`> [Internal Error](${new Date().toISOString()})`, err);
    res.status(500);
    res.json({ error: ErrorCode.INTERNAL_SERVER_ERROR });
  }
};
