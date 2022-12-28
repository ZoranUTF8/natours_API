// Import user model later
const jwt = require("jsonwebtoken");
const { NotFoundError } = require("../errors");

const notFound = (req, res, next) =>
  next(new NotFoundError(`${req.originalUrl} not found.`));

module.exports = notFound;
