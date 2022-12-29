// Import user model later
const jwt = require("jsonwebtoken");
const { NotFoundError } = require("../errors");

const notFound = (req, res, next) =>
  next(
    new NotFoundError(
      `${req.originalUrl} was not found on our server. Please check your input.`,
      "failed"
    )
  );

module.exports = notFound;
