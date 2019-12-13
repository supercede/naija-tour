import express from 'express';
import logger from 'morgan';
import { config } from 'dotenv';
import toursRouter from './routes/tourRoutes';
import usersRouter from './routes/userRoutes';

config();

const app = express();
const staticPath = `${__dirname}/../public`;

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

app.use(express.json());
app.use(express.static(staticPath));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

export default app;
