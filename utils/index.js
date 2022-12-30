const handleDuplicateKeyError = require("./handleDuplicateKeyError");
const handleMongooseValidationError = require("./handleMongooseValidationError");
const handleMongooseCastError = require("./handleMongooseCastError");
const handleJsonWebTokenError = require("./handleJsonWebTokenError");

module.exports = {
  handleDuplicateKeyError,
  handleMongooseValidationError,
  handleMongooseCastError,
  handleJsonWebTokenError,
};
