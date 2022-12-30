const User = require("../models/User");
const { NoPermissionError } = require("../errors/index");

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
