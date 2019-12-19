import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';

const userController = {};

userController.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

userController.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: {
      message: 'This route is not defined yet'
    }
  });
};

userController.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: {
      message: 'This route is not defined yet'
    }
  });
};

userController.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: {
      message: 'This route is not defined yet'
    }
  });
};

userController.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: {
      message: 'This route is not defined yet'
    }
  });
};

export default userController;
