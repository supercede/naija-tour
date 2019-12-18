import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import OpError from '../utils/errorClass';

config();

const authModule = {};

authModule.signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

authModule.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!password || !email) {
    return next(new OpError(400, 'email and password required'));
  }

  const user = await User.findOne({ email });
  //   const isRegistered = await bcrypt.compare(password, user.password);
  //   if (user && isRegistered) {
  const token = '';
  //     // jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  //     //   expiresIn: process.env.JWT_EXPIRES
  //     // });
  //     return res.status(200).json({
  //       status: 'success',
  //       token
  //     });
  //   }
  res.send({ token, user });
};

export default authModule;
