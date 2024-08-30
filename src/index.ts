import express from 'express';
import { startStorageServices } from './modules/external/storage';
import { startAIServices } from './modules/external/ai';

startStorageServices();
startAIServices();

const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send({ message: 'Hello World!' });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
