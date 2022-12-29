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
const authRouter = require("./routes/auth");
//! routes
app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/auth", authRouter);

//! Basic route
app.get("/", (req, res) => {
  res.send("<h1>natours API</h1> ");
});

//! Middleware in use
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
