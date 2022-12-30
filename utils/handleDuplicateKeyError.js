const { StatusCodes } = require("http-status-codes");

const handleDuplicateKeyError = (customError, err) => {
  customError.msg = `That value has already been used : ${Object.entries(
    err.keyValue
  )}. Please use a different value.`;

  customError.statusCode = StatusCodes.BAD_REQUEST;

  return customError;
};

module.exports = handleDuplicateKeyError;
