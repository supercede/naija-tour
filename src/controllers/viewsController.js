import Tour from '../models/tourModel';
import catchAsync from '../utils/catchAsync';
import OpError from '../utils/errorClass';

const viewsController = {};

viewsController.getOverview = catchAsync(async (req, res, next) => {
  //Get Tour from collection
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

viewsController.getTour = catchAsync(async (req, res, next) => {
  const slug = req.params.tourSlug;

  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new OpError(404, 'There is no tour with that name'));
  }

  res.status(200).render('tour', {
    title: tour.name,
    tour
  });
  // res.send(tour);
});

viewsController.loginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log in'
  });
};

viewsController.signupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign Up'
  });
};

viewsController.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'My Profile'
  });
};

viewsController.forgotPassword = (req, res) => {
  res.status(200).render('forgotPassword', {
    title: 'Forgot Password'
  });
};

viewsController.resetPassword = (req, res) => {
  res.status(200).render('resetPassword', {
    title: 'Reset Password'
  });
};

export default viewsController;
