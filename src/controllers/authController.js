import { promisify } from 'util';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import OpError from '../utils/errorClass';

config();

/**
 * @param {Number} id
 * @returns
 */
const generateToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  });
};

const authModule = {};

authModule.signUp = catchAsync(async (req, res, next) => {
  const {
    name,
    email,
    password,
    passwordConfirm,
    passwordLastChanged,
    role
  } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    passwordLastChanged,
    role
  });

  const token = generateToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

authModule.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!password || !email) {
    return next(new OpError(400, 'email and password required'));
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return next(new OpError(401, 'incorrect username or password'));
  }
  const token = generateToken(user._id);
  return res.status(200).json({
    status: 'success',
    token
  });
});

authModule.authenticate = catchAsync(async (req, res, next) => {
  //Check if user exists, details are correct and if token is in the request header
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new OpError(401, 'You need to login to access this resource'));
  }

  //Verify Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new OpError(401, 'This user does not exist'));
  }

  //Check if user password is unchanged
  if (currentUser.checkLastPasswordChange(decoded.iat)) {
    return next(new OpError(401, 'Please Log in Again'));
  }

  req.user = currentUser;
  next();
});

authModule.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new OpError(401, 'You are not authorized to perform this operation')
      );
    }
    next();
  };
};

export default authModule;
