import express from 'express';
import cors from 'cors';

import { Init } from './lib/db';
import CommentsRouter from './routes/comments';

const app = express();

app.use(cors());

app.use(`/comments`, CommentsRouter);

Init().then(() => {
  app.listen(4321, () => console.log(`App listening on port 4321.`));
});
