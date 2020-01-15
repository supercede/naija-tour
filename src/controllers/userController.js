import multer from 'multer';
import sharp from 'sharp';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import OpError from '../utils/errorClass';
import factoryFunctions from './handlerFunctions';

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new OpError(400, 'Please upload image files only'), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

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

userController.uploadUserPhoto = upload.single('photo');

userController.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

userController.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

userController.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new OpError(400, 'Update password using /updatePassword'));
  }

  //Filter out unwanted fields
  const filteredObj = filterObj(req.body, 'name', 'email');
  if (req.file) {
    filteredObj.photo = req.file.filename;
  }

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
