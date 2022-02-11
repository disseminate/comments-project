import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';

import { Init } from './lib/db';
import CommentsRouter from './routes/comments';
import Sockets from './lib/sockets';

const app = express();

app.use(cors());

app.use(`/comments`, CommentsRouter);

Init().then(() => {
  app.listen(4321, () => console.log(`App listening on port 4321.`));
});

const wss = new WebSocketServer({ port: 4322 });

wss.on('connection', (ws) => {
  Sockets.Register(ws);
});
