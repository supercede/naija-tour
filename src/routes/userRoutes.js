import express from 'express';
import userController from '../controllers/userController';
import authModule from '../controllers/authController';

const usersRouter = express.Router();

usersRouter.post('/signup', authModule.signUp);
usersRouter.post('/login', authModule.login);

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
