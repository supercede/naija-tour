import Stripe from 'stripe';
import Tour from '../models/tourModel';
import catchAsync from '../utils/catchAsync';
import factoryFunctions from './handlerFunctions';
import Booking from '../models/bookingModel';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const bookingController = {};

bookingController.getCheckoutSession = catchAsync(async (req, res, next) => {
  //get currently booked tour
  const tour = await Tour.findById(req.params.tourID);
  //create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourID
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
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

//create booking while redirecting to success url in view controller
//not secure, will be done with stripe webhooks when website is deployed
bookingController.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) {
    return next();
  }
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

bookingController.createBooking = factoryFunctions.createOne(Booking);
bookingController.getBooking = factoryFunctions.getOne(Booking);
bookingController.getAllBookings = factoryFunctions.getAll(Booking);
bookingController.updateBookings = factoryFunctions.updateOne(Booking);
bookingController.deleteBookings = factoryFunctions.deleteOne(Booking);

export default bookingController;
