import path from 'path';
import express from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xssFIlter from 'x-xss-protection';
import { config } from 'dotenv';
import hpp from 'hpp';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import toursRouter from './routes/tourRoutes';
import usersRouter from './routes/userRoutes';
import reviewsRouter from './routes/reviewRoutes';
import bookingRouter from './routes/bookingRoutes';
import viewRouter from './routes/viewRoutes';
import OpError from './utils/errorClass';
import errorHandler from './helpers/errors';

config();

const app = express();
// const staticPath = `${__dirname}/../public`;
const staticPath = path.join(__dirname, '../public');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//GLOBAL MIDDLEWARE
//STATIC FILES
app.use(express.static(staticPath));
//SECURITY HEADERS
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

//cors options
app.use(cors());
app.options('*', cors());

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
// app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

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

app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/', viewRouter);
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewsRouter);
app.use('/api/v1/bookings', bookingRouter);

//ERROR HANDLER
app.all('*', (req, res, next) => {
  next(new OpError(404, `Can't find ${req.originalUrl} on this server`));
});

app.use(errorHandler);

export default app;
