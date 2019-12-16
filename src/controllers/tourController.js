import Tour from '../models/tourModel';
import APIFeatures from '../utils/apiFeatures';

//Alias API
export const topTours = (req, res, next) => {
  req.query.sort = '-ratingsAverage,price';
  req.query.limit = 5;
  req.query.fields = 'name,duration,price,ratingsAverage,summary,difficulty';
  next();
};

export const getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .fieldLimit()
      .pagination();
    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: err.message
    });
  }
};

export const getTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);

    if (!tour) {
      throw new Error('Tour not found');
    }

    res.status(200).json({
      status: 'success',
      requestdAt: req.requestTime.message,
      tour
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

export const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    return res.status(201).json({
      status: 'success',
      tour: newTour
    });
  } catch (err) {
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

export const updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    if (!tour) {
      throw new Error('Tour not found');
    }
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

export const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findByIdAndDelete(id);

    if (!tour) {
      throw new Error('Id not found');
    }
    res.sendStatus(200);
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

export const getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          minRating: { $min: '$ratingsAverage' },
          maxRating: { $max: '$ratingsAverage' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgRating: 1 }
      }
      // {
      //   $match: { _id: { $ne: 'DIFFICULT' } }
      // }
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

export const getMonthlyStats = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const stat = await Tour.aggregate([
      {
        $unwind: {
          path: '$startDates'
        }
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: {
            $month: '$startDates'
          },
          numOfTours: { $sum: 1 },
          tours: {
            $push: {
              name: '$name',
              duration: '$duration',
              startDate: '$startDates'
            }
          }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numOfTours: -1 }
      }
    ]);

    // $group: {
    //   _id: { $toUpper: '$difficulty' },
    //   numTours: { $sum: 1 },

    res.status(200).json({
      status: 'success',
      results: stat.length,
      data: {
        stat
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};
