import * as express from 'express';
import CommentsRouter from './routes/comments';

const app = express();

app.use(`/comments`, CommentsRouter);

app.listen(4321, () => console.log(`App listening on port 4321.`));
