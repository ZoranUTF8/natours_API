const { StatusCodes } = require("http-status-codes");

const sendProdError = (err, res) => {

  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    status: err.status || "Failed",
    msg: err.message || "Something went wrong",
  };

  // Send the error message
  return res
    .status(customError.statusCode)
    .json({ msg: customError.msg, status: customError.status });
};

module.exports = sendProdError;
