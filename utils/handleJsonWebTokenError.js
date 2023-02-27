const { StatusCodes } = require("http-status-codes");

const handleJsonWebTokenError = (customError, err) => {
  switch (err.name) {
    case "TokenExpiredError":
      customError.msg = "TOKEN expired, please log in again.";
      customError.statusCode = StatusCodes.UNAUTHORIZED;
      break;
    case "JsonWebTokenError":
      customError.msg = "Token not valid, please log in again.";
      customError.statusCode = StatusCodes.UNAUTHORIZED;
      break;

    default:
      console.log("No such option in handle json web token error. ");
      break;
  }

  return customError;
};

module.exports = handleJsonWebTokenError;
