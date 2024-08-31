import express from 'express';
import { registerHandler } from '../use-case/register/register';

const uploadRouter = express.Router();

uploadRouter.post('/upload', express.json({ limit: '1Mb' }), registerHandler);

export { uploadRouter };
