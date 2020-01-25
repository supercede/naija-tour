import { Router } from 'express';
import bookingController from '../controllers/bookingController';
import authModule from '../controllers/authController';

const router = Router();

router.use(authModule.authenticate);

router.get('/checkout-session/:tourID', bookingController.getCheckoutSession);

router.use(authModule.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(authModule.authenticate, bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBookings)
  .delete(bookingController.deleteBookings);

export default router;
