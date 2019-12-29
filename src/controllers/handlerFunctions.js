import catchAsync from '../utils/catchAsync';
import OpError from '../utils/errorClass';
import APIFeatures from '../utils/apiFeatures';

const factoryFunctions = {};

factoryFunctions.createOne = Model => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    return res.status(201).json({
      status: 'success',
      data: doc
    });
  });
};

factoryFunctions.getAll = Model =>
  catchAsync(async (req, res, next) => {
    //To GET Tour reviews
    let filter = {};

    if (req.params.tourId) {
      filter = { tour: req.params.tourId };
    }
    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .fieldLimit()
      .pagination();
    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc
      }
    });
  });

factoryFunctions.getOne = (Model, popOpt) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);

    if (popOpt) {
      query = query.populate(popOpt);
    }

    const doc = await query;

    if (!doc) {
      return next(new OpError(404, 'Tour not found'));
    }

    res.status(200).json({
      status: 'success',
      requestdAt: req.requestTime.message,
      data: doc
    });
  });

factoryFunctions.updateOne = Model => {
  return catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new OpError(404, 'Data not found'));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });
};

factoryFunctions.deleteOne = Model => {
  return catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new OpError(404, 'Data not found'));
    }

    res.status(202).json({
      status: 'success',
      data: null
    });
  });
};

export default factoryFunctions;
