const { StatusCodes } = require("http-status-codes");

const sendDevError = (err, res) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    status: err.status || "Failed",
    msg: err.message || "Something went wrong",
    stack: err.stack,
    error: err,
  };

  // Send the error message
  return res.status(customError.statusCode).json({ customError });
};

module.exports = sendDevError;
