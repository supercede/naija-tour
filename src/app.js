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

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'error',
  //   message: `Can't find ${req.originalUrl}`
  // });
  const err = new Error(`Can't find ${req.originalUrl}`);
  err.statusCode = 404;
  err.status = 'error';
  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});

export default app;
