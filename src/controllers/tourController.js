import Tour from '../models/tourModel';

export const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(400).json({
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
  const allowedParams = Object.keys(Tour.schema.obj);
  const givenParams = Object.keys(req.body);
  const isAllowed = givenParams.every(param => allowedParams.includes(param));

  if (!isAllowed) {
    return res.status(400).json({
      status: 'error',
      message: 'Only name, price or rating is allowed'
    });
  }
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
