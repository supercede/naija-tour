import express from 'express';
import {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  createTour,
  topTours,
  getTourStats,
  getMonthlyStats
} from '../controllers/tourController';
import authModule from '../controllers/authController';
import reviewRouter from './reviewRoutes';

const toursRouter = express.Router();

// toursRouter.param('id', checkID);

toursRouter
  .route('/get-monthly-stats/:year')
  .get(
    authModule.authenticate,
    authModule.restrictTo('admin', 'lead-guide', 'guide'),
    getMonthlyStats
  );

toursRouter.route('/get-tour-stats').get(getTourStats);

toursRouter.route('/top-cheap-tours').get(topTours, getAllTours);

toursRouter
  .route('/')
  .get(getAllTours)
  .post(
    authModule.authenticate,
    authModule.restrictTo('admin', 'lead-guide'),
    createTour
  );

toursRouter
  .route('/:id')
  .get(getTour)
  .patch(
    authModule.authenticate,
    authModule.restrictTo('admin', 'lead-guide'),
    updateTour
  )
  .delete(
    authModule.authenticate,
    authModule.restrictTo('admin', 'lead-guide'),
    deleteTour
  );

toursRouter.use('/:tourId/reviews', reviewRouter);

// toursRouter
//   .route('/:tourId/reviews')
//   .post(
//     authModule.authenticate,
//     authModule.restrictTo('user'),
//     reviewController.createReview
//   );

export default toursRouter;
