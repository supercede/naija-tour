import { Router } from 'express';
import reviewController from '../controllers/reviewController';
import authModule from '../controllers/authController';

const router = Router({ mergeParams: true });

router.use(authModule.authenticate);

router
  .route('/')
  .post(
    authModule.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  )
  .get(reviewController.getReviews);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(authModule.restrictTo('user', 'admin'), reviewController.updateReview)
  .delete(
    authModule.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );
export default router;
