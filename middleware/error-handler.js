const { StatusCodes } = require("http-status-codes");
const {
  handleMongooseValidationError,
  handleDuplicateKeyError,
  handleMongooseCastError,
  handleJsonWebTokenError,
} = require("../utils/index");

const MONGOOSE_DUPLICATE_KEY_ERROR_CODE = 11000;
const MONGOOSE_VALIDATION_ERROR = "ValidationError";
const MONGOOSE_CAST_ERROR = "CastError";
const JWT_ERROR = "JsonWebTokenError";
const EXPIRED_JWT = "TokenExpiredError";

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    status: err.status || "Failed",
    msg: err.message || "Something went wrong",
  };

  // If error from mongoose make more user friendly error message
  if (err.name === MONGOOSE_VALIDATION_ERROR) {
    customError = handleMongooseValidationError(customError, err);
  }
  // Duplicate register value
  if (err.code && err.code === MONGOOSE_DUPLICATE_KEY_ERROR_CODE) {
    customError = handleDuplicateKeyError(customError, err);
  }
  // Wrong format of request value
  if (err.name === MONGOOSE_CAST_ERROR) {
    customError = handleMongooseCastError(customError, err);
  }
  // JWT invalid token
  if (err.name === JWT_ERROR || EXPIRED_JWT) {
    customError = handleJsonWebTokenError(customError, err);
  }

  // Send the error message
  res
    .status(customError.statusCode)
    .json({ msg: customError.msg, status: customError.status });
};

module.exports = errorHandlerMiddleware;
