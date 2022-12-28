const express = require("express");
const { StatusCodes } = require("http-status-codes");

const app = express();

app.use(express.json());
//! Middleware
const authenticationMiddleware = require("./middleware/authentication");
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/resource-not-found");
//! routers
const toursRouter = require("./routes/tours");
const usersRouter = require("./routes/users");
//! routes
app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/users", usersRouter);

//! Basic route
app.get("/", (req, res) => {
  res.send("<h1>natours API</h1> ");
});
// app.all("*", (req, res, next) => {
//   // res.status(StatusCodes.NOT_FOUND).json({
//   //   status: "fail",
//   //   message: `We can't find the ${req.originalUrl} that you requested.`,
//   // });
//   const error = new Error("This is a message");
//   error.status = "fail";
//   error.statusCode = 404;
//   next(error);
// });
//! Middleware in use
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
