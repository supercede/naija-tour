import { Router } from 'express';
import viewsController from '../controllers/viewsController';
import authModule from '../controllers/authController';

const viewRouter = Router();

viewRouter.get('/', authModule.isLoggedIn, viewsController.getOverview);
viewRouter.get(
  '/tour/:tourSlug',
  authModule.isLoggedIn,
  viewsController.getTour
);
viewRouter.get('/login', authModule.isLoggedIn, viewsController.loginForm);
viewRouter.get('/signup', authModule.isLoggedIn, viewsController.signupForm);
viewRouter.get('/me', authModule.authenticate, viewsController.getAccount);

export default viewRouter;
