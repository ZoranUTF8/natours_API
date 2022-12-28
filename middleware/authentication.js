// Import user model later
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  // Check request header for the jwt token
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    next(new UnauthenticatedError("Invalid token"));
  }

  next();
};

module.exports = auth;
