const express = require("express");

const app = express();

app.use(express.json());
//! Middleware
const authenticationMiddleware = require("./middleware/authentication");
const errorHandlerMiddleware = require("./middleware/error-handler");
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

//! Middleware in use
// app.use(errorHandlerMiddleware);

module.exports = app;
