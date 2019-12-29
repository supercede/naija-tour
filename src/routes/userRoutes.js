import express from 'express';
import userController from '../controllers/userController';
import authModule from '../controllers/authController';

const usersRouter = express.Router();

usersRouter.post('/signup', authModule.signUp);
usersRouter.post('/login', authModule.login);
usersRouter.post('/forgotPassword', authModule.forgotPassword);
usersRouter.patch('/resetPassword/:token', authModule.resetPassword);

//Protect Routes that occur after this middleware
usersRouter.use(authModule.authenticate);

usersRouter.patch('/updatePassword', authModule.changePassword);

usersRouter.get('/me', userController.getMe, userController.getUser);

usersRouter.patch('/updateMe', userController.updateMe);

usersRouter.delete('/deleteMe', userController.deleteMe);

//Restrict all routes after this to admin only
usersRouter.use(authModule.restrictTo('admin'));

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
