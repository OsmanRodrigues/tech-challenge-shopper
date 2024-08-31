import express from 'express';
import { verifyHandler } from '../use-case/verify/verify';
const commonRouter = express.Router();

commonRouter.patch('/confirm', verifyHandler);
commonRouter.get('/', (req, res) => {
  res.send({ message: `Web server is available. ${new Date().toISOString()}` });
});

export { commonRouter };
