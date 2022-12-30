const CustomAPIError = require("./CustomApiError");
const UnauthenticatedError = require("./unauthenticated");
const NotFoundError = require("./NotFoundError");
const BadRequestError = require("./BadRequestError");
const JsonWebTokenError = require("./JsonWebTokenError");

module.exports = {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  JsonWebTokenError,
};
