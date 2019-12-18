export default class OpError extends Error {
  /**
   *Creates an instance of OpError.
   * @param {Number} statusCode
   * @param {String} message
   * @memberof OpError
   */
  constructor(statusCode, message) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
