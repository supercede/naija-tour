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

const toursRouter = express.Router();

// toursRouter.param('id', checkID);

toursRouter.route('/get-monthly-stats/:year').get(getMonthlyStats);

toursRouter.route('/get-tour-stats').get(getTourStats);

toursRouter.route('/top-cheap-tours').get(topTours, getAllTours);

toursRouter
  .route('/')
  .get(getAllTours)
  .post(createTour);

toursRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

export default toursRouter;
