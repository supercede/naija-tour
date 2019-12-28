import { Router } from 'express';
import reviewController from '../controllers/reviewController';
import authModule from '../controllers/authController';

const router = Router({ mergeParams: true });

router
  .route('/')
  .post(
    authModule.authenticate,
    authModule.restrictTo('user'),
    reviewController.createReview
  )
  .get(reviewController.getReviews);

export default router;
