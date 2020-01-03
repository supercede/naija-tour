import { Router } from 'express';
import viewsController from '../controllers/viewsController';

const viewRouter = Router();

viewRouter.get('/', viewsController.getOverview);

viewRouter.get('/tour', viewsController.getTour);

export default viewRouter;
