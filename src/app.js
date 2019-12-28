import express from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xssFIlter from 'x-xss-protection';
import { config } from 'dotenv';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import toursRouter from './routes/tourRoutes';
import usersRouter from './routes/userRoutes';
import reviewsRouter from './routes/reviewRoutes';
import OpError from './utils/errorClass';
import errorHandler from './helpers/errors';

config();

const app = express();
const staticPath = `${__dirname}/../public`;

//GLOBAL MIDDLEWARE
//SECURITY HEADERS
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

//RATE LIMITER
const limiter = rateLimit({
  max: 120,
  windowMs: 60 * 60 * 1000,
  message:
    'We have noticed an unusual amount of request from this IP, please try again later'
});

app.use('/api', limiter);

//BODY PARSER
app.use(express.json({ limit: '10kb' }));

//Data Sanitization
//-against NoSQL query Injection
app.use(mongoSanitize());
//-against XSS
app.use(xssFIlter());

//FIX PARAMETER POLLUTION
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQunatity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

//STATIC FILES
app.use(express.static(staticPath));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewsRouter);

//ERROR HANDLER
app.all('*', (req, res, next) => {
  next(new OpError(404, `Can't find ${req.originalUrl} on this server`));
});

app.use(errorHandler);

export default app;
