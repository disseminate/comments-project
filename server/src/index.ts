import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';

import { Init } from './lib/db';
import CommentsRouter from './routes/comments';
import Sockets from './lib/sockets';

const app = express();

app.use(cors());

app.use(express.static('client'));

app.use(`/comments`, CommentsRouter);

Init().then(() => {
  app.listen(process.env.PORT, () => console.log(`App listening on port ${process.env.PORT}.`));
});

const wss = new WebSocketServer({ port: parseInt(process.env.WS_PORT, 10) });

wss.on('connection', (ws) => {
  Sockets.Register(ws);
});
