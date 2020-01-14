import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import OpError from '../utils/errorClass';
import factoryFunctions from './handlerFunctions';

const filterObj = (obj, ...allowedParams) => {
  const newObj = {};
  Object.keys(obj).forEach(key => {
    if (allowedParams.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

const userController = {};

userController.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

userController.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new OpError(400, 'Update password using /updatePassword'));
  }
  const filteredObj = filterObj(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredObj, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

userController.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  return res.status(204).json({
    status: 'success',
    data: null
  });
});

userController.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: {
      message: 'This route is not defined, please use /signup instead'
    }
  });
};

userController.getUser = factoryFunctions.getOne(User);
userController.getAllUsers = factoryFunctions.getAll(User);
userController.updateUser = factoryFunctions.updateOne(User);
userController.deleteUser = factoryFunctions.deleteOne(User);

export default userController;
