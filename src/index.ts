import express from 'express';
import { startStorageServices } from './modules/external/storage';
import { startAIServices } from './modules/external/ai';
import * as routes from './modules/routes';
import { errorHandler } from './shared/utils/error.utils';

startStorageServices();
startAIServices();

const app = express();
const port = 5000;

app.use('/', routes.uploadRouter);
app.use(express.json());
app.use('/', routes.commonRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
