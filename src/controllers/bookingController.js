import Stripe from 'stripe';
import Tour from '../models/tourModel';
import catchAsync from '../utils/catchAsync';
import factoryFunctions from './handlerFunctions';
import Booking from '../models/bookingModel';
import User from '../models/userModel';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const bookingController = {};

bookingController.getCheckoutSession = catchAsync(async (req, res, next) => {
  //get currently booked tour
  const tour = await Tour.findById(req.params.tourID);
  //create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    // success_url: `${req.protocol}://${req.get('host')}/?tour=${
    //   req.params.tourID
    success_url: `${req.protocol}://${req.get('host')}/my-tours`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [
          `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`
        ],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1
      }
    ]
  });
  //create session
  res.status(200).json({
    status: 'success',
    session
  });
});

const createBookingCheckout = async session => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.display_items[0].amount / 100;
  await Booking.create({ tour, user, price });
};

bookingController.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    createBookingCheckout(event.data.object);
  }

  res.status(200).json({ received: true });
};

bookingController.createBooking = factoryFunctions.createOne(Booking);
bookingController.getBooking = factoryFunctions.getOne(Booking);
bookingController.getAllBookings = factoryFunctions.getAll(Booking);
bookingController.updateBookings = factoryFunctions.updateOne(Booking);
bookingController.deleteBookings = factoryFunctions.deleteOne(Booking);

export default bookingController;
