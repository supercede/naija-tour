import Review from '../models/reviewModel';
import factoryFunctions from './handlerFunctions';
import catchAsync from '../utils/catchAsync';
import Booking from '../models/bookingModel';
import OpError from '../utils/errorClass';

const reviewController = {};

reviewController.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

reviewController.checkUserValidity = catchAsync(async (req, res, next) => {
  //check if user has booked tour
  let booked;
  const { user, tour } = req.body;
  const bookedTour = await Booking.findOne({
    user,
    tour
  });

  if (bookedTour) {
    booked = true;
  } else {
    booked = false;
  }

  if (!booked) {
    return next(
      new OpError(403, 'You need to have booked a tour to review it')
    );
  }

  //ensure user doesn't review twice on the same tour
  const checkUser = await Review.findOne({ user, tour });
  if (checkUser) {
    return next(
      new OpError(403, 'Multiple reviews not allowed. Delete previous one.')
    );
  }

  next();
});

reviewController.createReview = factoryFunctions.createOne(Review);
reviewController.getReviews = factoryFunctions.getAll(Review);
reviewController.getReview = factoryFunctions.getOne(Review);
reviewController.updateReview = factoryFunctions.updateOne(Review);
reviewController.deleteReview = factoryFunctions.deleteOne(Review);

export default reviewController;
