import { Router } from 'express';
import viewsController from '../controllers/viewsController';
import authModule from '../controllers/authController';

const viewRouter = Router();

viewRouter.use(authModule.isLoggedIn);

viewRouter.get('/', viewsController.getOverview);
viewRouter.get('/tour/:tourSlug', viewsController.getTour);
viewRouter.get('/login', viewsController.loginForm);
viewRouter.get('/signup', viewsController.signupForm);

export default viewRouter;
