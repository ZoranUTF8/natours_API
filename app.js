const express = require("express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
//? 200 requests per hour
//* Prevent denail fo service and brute force attacks
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: "To many requests from your IP, please try again in 1 hour.",
});

const app = express();

//! Middleware
const authenticationMiddleware = require("./middleware/authentication");
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/resource-not-found");

//! Middleware in use
app.use(helmet());
// ? Body parser, reading data frm the body to req.body
app.use(express.json({ limit: "10kb" }));
app.use("/api", limiter);

//? Data sanitization against NoSql injections
//* Example how someone can log in by just knowing the password "email":{"$gt":""},   "password": "sifra2023" will log us in as gt will always be true
app.use(mongoSanitize());
//? Data sanitization against XSS (cross site scripting attack)
app.use(xss());
//? Preventing parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);
//?Serving static files
app.use(express.static(`${__dirname}/public`));
//! routers
const toursRouter = require("./routes/tours");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const reviewsRouter = require("./routes/reviews");

//! routes
app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authenticationMiddleware, usersRouter);
app.use("/api/v1/reviews", authenticationMiddleware, reviewsRouter);

//! Basic route
app.get("/", (req, res) => {
  res.send("<h1>natours API</h1> ");
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
