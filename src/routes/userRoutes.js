import express from 'express';
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController';
import authModule from '../controllers/authController';

const usersRouter = express.Router();

usersRouter.post('/signup', authModule.signUp);
usersRouter.post('/login', authModule.login);

usersRouter
  .route('/')
  .get(getAllUsers)
  .post(createUser);

usersRouter
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

export default usersRouter;
