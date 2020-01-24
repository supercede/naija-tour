import Stripe from 'stripe';
import Tour from '../models/tourModel';
import catchAsync from '../utils/catchAsync';
import factoryFunctions from './handlerFunctions';
import OpError from '../utils/errorClass';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const bookingController = {};

bookingController.getCheckoutSession = catchAsync(async (req, res, next) => {
  //get currently booked tour
  const tour = Tour.findById(req.params.tourID);
  //create checkout session
  stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary
      }
    ]
  });
  //create session
});

export default bookingController;
