const express = require("express");

const app = express();

app.use(express.json());
//! Middleware
const authenticationMiddleware = require("./middleware/authentication");
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/resource-not-found");
//! routers
const toursRouter = require("./routes/tours");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
//! routes
app.use("/api/v1/tours", authenticationMiddleware, toursRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authenticationMiddleware, usersRouter);

//! Basic route
app.get("/", (req, res) => {
  res.send("<h1>natours API</h1> ");
});

//! Middleware in use
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
