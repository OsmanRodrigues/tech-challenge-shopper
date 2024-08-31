import express from 'express';
import { verifyHandler } from '../use-case/verify/verify';
import { listRequestHandler } from '../use-case/list/list';
const commonRouter = express.Router();

commonRouter.get('/:customer_code/list', listRequestHandler);
commonRouter.patch('/confirm', verifyHandler);
commonRouter.get('/', (req, res) => {
  res.send({ message: `Web server is available. ${new Date().toISOString()}` });
});

export { commonRouter };
