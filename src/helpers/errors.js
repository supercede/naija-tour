import { config } from 'dotenv';
import OpError from '../utils/errorClass';

config();

const handleDBCastError = err => {
  err.message = `Invalid ${err.path}: ${err.value}`;
  return new OpError(400, err.message);
};
const handleDBDuplicateError = err => {
  const value = err.errmsg.match(/"([^"]*)"/);
  err.message = `Duplicate value ${value[0]}, please enter another value`;
  return new OpError(400, err.message);
};
const handleDBValidationError = err => {
  console.log(err.errors);
  const messageArr = Object.values(err.errors).map(val => val.message);
  console.log(messageArr);
  return new OpError(400, messageArr.join(', '));
};

const errorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const errorProd = (err, res) => {
  //Operational errors
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    //Unknown errors
    console.error('Error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    errorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') {
      error = handleDBCastError(error);
    }
    if (error.code === 11000) {
      error = handleDBDuplicateError(error);
    }
    if (error.name === 'ValidationError') {
      error = handleDBValidationError(error);
    }
    errorProd(error, res);
  }
};

export default errorHandler;
