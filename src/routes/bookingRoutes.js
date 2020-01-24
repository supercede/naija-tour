import { Router } from 'express';
import bookingController from '../controllers/bookingController';
import authModule from '../controllers/authController';

const router = Router();

router.use(authModule.authenticate);
router.get('/checkout-session/:tourID', bookingController.getCheckoutSession);

export default router;
