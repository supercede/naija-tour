import { Router } from 'express';
import reviewController from '../controllers/reviewController';
import authModule from '../controllers/authController';

const router = Router({ mergeParams: true });

router
  .route('/')
  .post(
    authModule.authenticate,
    authModule.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  )
  .get(reviewController.getReviews);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);
export default router;
