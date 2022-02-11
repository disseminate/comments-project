import * as express from 'express';
import Database from '../lib/db';
import * as Yup from 'yup';
import { randomUUID } from 'crypto';
import fetch from 'node-fetch';
import * as bodyParser from 'body-parser';
import Sockets from '../lib/sockets';

const Router = express.Router();

Router.get('/', async (req, res) => {
  const comments = await Database.select({
    id: 'comments.id',
    user_avatar: 'comments.user_avatar',
    user_name: 'comments.user_name',
    created_at: 'comments.created_at',
    body: 'comments.body',
    upvotes: Database('upvotes').count('*').whereRaw('?? = ??', ['upvotes.comment_id', 'comments.id']),
  })
    .from('comments')
    .leftJoin('upvotes', 'comments.id', 'upvotes.comment_id')
    .groupBy('comments.id')
    .orderBy('upvotes', 'desc')
    .orderBy('created_at', 'desc');

  res.status(200).json({ comments });
});

const commentSchema = Yup.object({
  body: Yup.string().required(),
});

interface RandomProfileResponse {
  name: { title: string; first: string; last: string };
  picture: {
    large: string;
  };
}

Router.post('/', bodyParser.json(), async (req, res) => {
  let body: { body: string } = null;

  try {
    body = await commentSchema.validate(req.body);
  } catch (err) {
    console.error(err);
    res.status(400).end();
    return;
  }

  let userName = 'User Name';
  let userAvatar = '';

  try {
    const profileResp = await fetch(`https://randomuser.me/api/`);
    const profile: { results: RandomProfileResponse[] } = await profileResp.json();
    userName = profile.results[0].name.first + ' ' + profile.results[0].name.last;
    userAvatar = profile.results[0].picture.large;
  } catch (err) {
    console.error(err);
  }

  const newComment = {
    id: randomUUID(),
    user_name: userName,
    user_avatar: userAvatar,
    created_at: new Date(),
    ...body,
  };

  await Database('comments').insert(newComment);

  Sockets.Broadcast('comment', newComment);

  res.status(200).json({ ...newComment, upvotes: 0 });
  res.end();
});

Router.post('/:id/upvote', async (req, res) => {
  const comment = await Database('comments').select({ id: 'id' }).where('id', req.params.id).first();
  if (!comment) {
    res.status(400).end();
    return;
  }

  const newUpvote = {
    id: randomUUID(),
    comment_id: comment.id,
  };

  await Database('upvotes').insert(newUpvote);

  Sockets.Broadcast('upvote', { id: comment.id });

  res.status(200).json(newUpvote);
  res.end();
});

export default Router;
