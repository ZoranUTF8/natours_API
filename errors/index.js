const CustomAPIError = require("./CustomApiError");
const UnauthenticatedError = require("./unauthenticated");
const NotFoundError = require("./NotFoundError");
const BadRequestError = require("./BadRequestError");

module.exports = {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
};
