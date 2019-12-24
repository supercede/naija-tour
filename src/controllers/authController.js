import crypto from 'crypto';
import { promisify } from 'util';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import OpError from '../utils/errorClass';
import sendMail from '../utils/emails';

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

const createSendToken = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }
  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
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

  createSendToken(newUser, 201, res);
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

  createSendToken(user, 200, res);
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

authModule.forgotPassword = catchAsync(async (req, res, next) => {
  //Get User by POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new OpError(404, 'There is no user with that email'));
  }

  //Generate random token
  const resetToken = user.resetPasswordToken();
  await user.save({ validateBeforeSave: false });

  //send it to user mail
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot password? Please submit a patch request with your new password and passwordConfirm to ${resetURL}.\n If you didn't request this, please ignore this message. This link expires in 10 minutes.`;
  try {
    await sendMail({
      email: user.email,
      subject: 'Reset Password',
      message
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new OpError(500, 'Problem sending mail, try again later'));
  }

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email'
  });
});

authModule.resetPassword = catchAsync(async (req, res, next) => {
  //Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() }
  });

  //Check if token has not expired if user exists, then set password,
  if (!user) {
    return next(new OpError(400, 'Token is invalid or expired'));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;

  await user.save();

  //update passwordLastChanged passwordLastChanged property for user
  //Log user in, send jwt

  createSendToken(user, 200, res);
});

authModule.changePassword = catchAsync(async (req, res, next) => {
  //Get user from collection
  const user = await User.findById(req.user.id).select('password');
  //Check if POSTed current password is correct
  const checkPassword = await user.comparePassword(req.body.currentPassword);

  if (!checkPassword) return next(new OpError(401, 'Wrong password'));
  //If so, update password,
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //Log user in, send JWT
  createSendToken(user, 200, res);
});

export default authModule;