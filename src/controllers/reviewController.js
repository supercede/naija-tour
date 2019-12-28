import Review from '../models/reviewModel';
import catchAsync from '../utils/catchAsync';

const reviewController = {};

reviewController.createReview = catchAsync(async (req, res, next) => {
  //Nested Routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    review
  });
});

reviewController.getReviews = catchAsync(async (req, res, next) => {
  let filter = {};

  if (req.params.tourId) {
    filter = { tour: req.params.tourId };
  }

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    reviews
  });
});

export default reviewController;
