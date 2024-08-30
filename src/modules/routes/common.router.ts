import express from 'express';
const commonRouter = express.Router();

commonRouter.get('/', (req, res) => {
  res.send({ message: `Web server is available. ${new Date().toISOString()}` });
});

export { commonRouter };
