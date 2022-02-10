import * as express from 'express';

const Router = express.Router();

Router.get('/', async (req, res) => {
  res.statusCode = 200;
  res.end();
});

Router.post('/', async (req, res) => {
  res.statusCode = 204;
  res.end();
});

export default Router;
