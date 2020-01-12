import { Router } from 'express';
import viewsController from '../controllers/viewsController';

const viewRouter = Router();

viewRouter.get('/', viewsController.getOverview);

viewRouter.get('/tour/:tourSlug', viewsController.getTour);

viewRouter.get('/login', viewsController.loginForm);

export default viewRouter;
