// Import user model later
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { UnauthenticatedError, BadRequestError } = require("../errors");
const catchAsyncError = require("../utils/catchAsyncError");
const User = require("../models/User");

const auth = catchAsyncError(async (req, res, next) => {
  // Check request header for the jwt token
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    next(new UnauthenticatedError("Invalid token"));
  }
  //   extract the token from the authorization
  const token = authHeader.split(" ")[1];

  const decodedJWTPayload = await promisify(jwt.verify)(
    token,
    process.env.JWT_KEY
  );

  // Check if the user with the decoded id exists in the database
  const user = await User.findById(decodedJWTPayload.id);
  if (!user) {
    return next(new BadRequestError("User account has been deleted."));
  }

  // Check if user has changed the password since the token was issued
  if (user.changedPassword(decodedJWTPayload.iat)) {
    return next(
      new BadRequestError(
        "User account has changed password, please log in again."
      )
    );
  }

  console.log("USER IN AUTHENTICATION BACKEND ", user);

  // If all check completed grant access to the routes
  // attach the verified user to the employee routes
  req.user = user;
  next();
});

module.exports = auth;
