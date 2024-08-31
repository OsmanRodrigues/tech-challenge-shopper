import type { RequestHandler } from 'express';

export const requestHandlerWrapper = (
  useCaseConsume: (data: any) => Promise<any>,
  options?: { withBody?: boolean }
): RequestHandler => {
  return (req, res, next) => {
    useCaseConsume(options?.withBody ? req.body : undefined)
      .then((resData) => res.send(resData))
      .catch((err) => next(err));
  };
};
