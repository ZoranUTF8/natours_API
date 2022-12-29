const { StatusCodes } = require("http-status-codes");

const handleMongooseValidationError = (customError, err) => {
  customError.msg = Object.values(err.errors)
    .map((item) => item.message)
    .join(",");
  customError.statusCode = StatusCodes.BAD_REQUEST;

  return customError;
};

module.exports = handleMongooseValidationError;
