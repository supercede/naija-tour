import express from 'express';
import {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  createTour,
  topTours
} from '../controllers/tourController';

const toursRouter = express.Router();

// toursRouter.param('id', checkID);

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
