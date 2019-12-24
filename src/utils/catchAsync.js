/**
 *Error handler for async functions
 * @param {Function} fn
 * @returns {Fumction}
 */
const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
