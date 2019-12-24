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

const toursRouter = express.Router();

// toursRouter.param('id', checkID);

toursRouter.route('/get-monthly-stats/:year').get(getMonthlyStats);

toursRouter.route('/get-tour-stats').get(getTourStats);

toursRouter.route('/top-cheap-tours').get(topTours, getAllTours);

toursRouter
  .route('/')
  .get(authModule.authenticate, getAllTours)
  .post(createTour);

toursRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(
    authModule.authenticate,
    authModule.restrictTo('admin', 'lead-guide'),
    deleteTour
  );

export default toursRouter;
