import Tour from '../models/tourModel';
import catchAsync from '../utils/catchAsync';

const viewsController = {};

viewsController.getOverview = catchAsync(async (req, res) => {
  //Get Tour from collection
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

viewsController.getTour = catchAsync(async (req, res) => {
  const slug = req.params.tourSlug;

  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  console.log(slug);
  res.status(200).render('tour', {
    title: tour.name,
    tour
  });
  // res.send(tour);
});

export default viewsController;
