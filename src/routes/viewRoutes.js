import { Router } from 'express';
import viewsController from '../controllers/viewsController';
import authModule from '../controllers/authController';
// import bookingController from '../controllers/bookingController';

const viewRouter = Router();

viewRouter.get(
  '/',
  // bookingController.createBookingCheckout,
  authModule.isLoggedIn,
  viewsController.getOverview
);
viewRouter.get(
  '/tour/:tourSlug',
  authModule.isLoggedIn,
  viewsController.getTour
);
viewRouter.get('/login', authModule.isLoggedIn, viewsController.loginForm);
viewRouter.get('/signup', authModule.isLoggedIn, viewsController.signupForm);
viewRouter.get('/me', authModule.authenticate, viewsController.getAccount);
viewRouter.get(
  '/reviews',
  authModule.authenticate,
  viewsController.getUserReviews
);
viewRouter.get(
  '/my-tours',
  authModule.authenticate,
  viewsController.getMyTours
);

viewRouter.get(
  '/:slug/write-review',
  authModule.authenticate,
  viewsController.getReviewPage
);

viewRouter.get('/forgot-password', viewsController.forgotPassword);
viewRouter.get('/resetPassword/:token', viewsController.resetPassword);

export default viewRouter;
