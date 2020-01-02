import Tour from '../models/tourModel';
import catchAsync from '../utils/catchAsync';
import factoryFunctions from './handlerFunctions';
import OpError from '../utils/errorClass';

//Alias API
export const topTours = (req, res, next) => {
  req.query.sort = '-ratingsAverage,price';
  req.query.limit = 5;
  req.query.fields = 'name,duration,price,ratingsAverage,summary,difficulty';
  next();
};

export const getAllTours = factoryFunctions.getAll(Tour);
export const getTour = factoryFunctions.getOne(Tour, 'reviews');
export const createTour = factoryFunctions.createOne(Tour);
export const updateTour = factoryFunctions.updateOne(Tour);
export const deleteTour = factoryFunctions.deleteOne(Tour);

export const getTourStats = catchAsync(async (req, res, next) => {
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
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

export const getMonthlyStats = catchAsync(async (req, res, next) => {
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

  res.status(200).json({
    status: 'success',
    results: stat.length,
    data: {
      stat
    }
  });
});

export const getNearbyTours = catchAsync(async (req, res, next) => {
  const { distance, latlong, unit } = req.params;
  const [lat, long] = latlong.split(',');

  if (!lat || !long) {
    next(
      new OpError(
        400,
        'Please provide the latitude and longitude in the format lat,long'
      )
    );
  }

  let radius;
  if (unit === 'mi') {
    radius = distance / 3958.8;
  } else if (unit === 'km') {
    radius = distance / 6371;
  } else {
    next(new OpError(400, 'Units can only be specified in km or mi(miles)'));
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[long, lat], radius] } }
  });

  res.status(200).json({
    result: tours.length,
    data: {
      tours
    }
  });
});

export const getDistances = catchAsync(async (req, res, next) => {
  const { latlong, unit } = req.params;
  const [lat, long] = latlong.split(',');

  if (!lat || !long) {
    next(
      new OpError(
        400,
        'Please provide the latitude and longitude in the format lat,long'
      )
    );
  }

  let multiplier;
  if (unit === 'mi') {
    multiplier = 0.000621371;
  } else if (unit === 'km') {
    multiplier = 0.001;
  } else {
    next(new OpError(400, 'Units can only be specified in km or mi(miles)'));
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [long * 1, lat * 1]
        },
        distanceField: `distance`,
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    data: {
      data: distances
    }
  });
});
