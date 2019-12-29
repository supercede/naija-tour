import express from 'express';
import userController from '../controllers/userController';
import authModule from '../controllers/authController';

const usersRouter = express.Router();

usersRouter.post('/signup', authModule.signUp);
usersRouter.post('/login', authModule.login);

usersRouter.post('/forgotPassword', authModule.forgotPassword);
usersRouter.patch('/resetPassword/:token', authModule.resetPassword);

usersRouter.patch(
  '/updatePassword',
  authModule.authenticate,
  authModule.changePassword
);

usersRouter.get(
  '/me',
  authModule.authenticate,
  userController.getMe,
  userController.getUser
);

usersRouter.patch(
  '/updateMe',
  authModule.authenticate,
  userController.updateMe
);

usersRouter.delete(
  '/deleteMe',
  authModule.authenticate,
  userController.deleteMe
);

usersRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

usersRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default usersRouter;
