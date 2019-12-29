import Review from '../models/reviewModel';
// import catchAsync from '../utils/catchAsync';
import factoryFunctions from './handlerFunctions';

const reviewController = {};

reviewController.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

reviewController.createReview = factoryFunctions.createOne(Review);
reviewController.getReviews = factoryFunctions.getAll(Review);
reviewController.getReview = factoryFunctions.getOne(Review);
reviewController.updateReview = factoryFunctions.updateOne(Review);
reviewController.deleteReview = factoryFunctions.deleteOne(Review);

export default reviewController;
