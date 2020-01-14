import { config } from 'dotenv';
import OpError from '../utils/errorClass';

config();

const handleDBCastError = err => {
  err.message = `Invalid ${err.path}: ${err.value}`;
  return new OpError(400, err.message);
};
const handleDBDuplicateError = err => {
  const value = err.errmsg.match(/"([^"]*)"/);
  err.message = `${value[0]} already exists, please login or  req, enter another value`;
  return new OpError(400, err.message);
};
const handleDBValidationError = err => {
  const messageArr = Object.values(err.errors).map(val => val.message);
  return new OpError(400, messageArr.join(', '));
};
const handleJWTSignatureError = err => {
  err.message = 'invalid JWT signature, please login again';
  return new OpError(401, err.message);
};

const handleExpiredJWTError = err => {
  err.message = 'JWT expired, please log in again';
  return new OpError(401, err.message);
};

const errorDev = (err, req, res) => {
  //API requests
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    });
  }
  //Browser requests
  console.error('Error:', err);

  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    message: err.message
  });
};

const errorProd = (err, req, res) => {
  //A. API REQUEST
  if (req.originalUrl.startsWith('/api')) {
    // A. Operational errors
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // B. Unknown errors
    //1. Log error
    console.error('Error:', err);
    //2. Send Generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
  // B. Browser rendered website
  //If Operational errors
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      message: err.message
    });
  }
  //else if Unknown/Programming errors
  //1. Log error
  console.error('Error:', err);
  //2. Send Generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    message: 'Please try again later'
  });
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    errorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (error.name === 'CastError') {
      error = handleDBCastError(error);
    }
    if (error.code === 11000) {
      error = handleDBDuplicateError(error);
    }
    if (error.name === 'ValidationError') {
      error = handleDBValidationError(error);
    }
    if (error.name === 'JsonWebTokenError') {
      error = handleJWTSignatureError(error);
    }
    if (error.name === 'TokenExpiredError') {
      error = handleExpiredJWTError(error);
    }

    errorProd(error, req, res);
  }
};

export default errorHandler;
