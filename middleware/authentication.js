// Import user model later
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");
const catchAsyncError = require("../utils/catchAsyncError");

const auth = catchAsyncError(async (req, res, next) => {
  console.log(req.headers);
  // Check request header for the jwt token
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    next(new UnauthenticatedError("Invalid token"));
  }
  next();
});

module.exports = auth;
