const { StatusCodes } = require("http-status-codes");

const handleMongooseCastError = (customError, err) => {
  customError.msg = `No item found for the provided item id of : ${err.value}. Check your input.`;
  customError.statusCode = StatusCodes.NOT_FOUND;

  return customError;
};

module.exports = handleMongooseCastError;
