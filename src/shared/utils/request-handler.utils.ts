import type { RequestHandler } from 'express';

export const requestHandlerWrapper = (
  useCaseConsume: (data: any) => Promise<any>,
  options?: {
    withBody?: boolean;
    withReqParams?: boolean;
    withQueryParams?: boolean;
  }
): RequestHandler => {
  return (req, res, next) => {
    let dataFallback = {};

    if (options?.withBody) {
      dataFallback = { ...dataFallback, ...req.body };
    }
    if (options?.withReqParams) {
      dataFallback = { ...dataFallback, ...req.params };
    }
    if (options?.withQueryParams) {
      dataFallback = { ...dataFallback, ...req.query };
    }

    useCaseConsume(dataFallback)
      .then((resData) => res.send(resData))
      .catch((err) => next(err));
  };
};
