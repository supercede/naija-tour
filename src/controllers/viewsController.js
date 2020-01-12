import Tour from '../models/tourModel';
import catchAsync from '../utils/catchAsync';

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

export default viewsController;
