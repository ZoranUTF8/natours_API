const User = require("../models/User");
const { NoPermissionError } = require("../errors/index");

// ! Check if the user witht he specific role has the right to perform the desired action
const restrictToMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new NoPermissionError(
          "You do not have permission to perform this action."
        )
      );
    }
    next();
  };
};

module.exports = restrictToMiddleware;
