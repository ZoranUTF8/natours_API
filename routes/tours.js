const express = require("express");
const aliasGetTopFive = require("../middleware/top-five-tours");
const restrictToMiddleware = require("../middleware/restrictToMiddleware");
const authenticationMiddleware = require("../middleware/authentication");

//! Router nested
/* Free access for :
1. Get all tours
2. Get single tour
3. Other stats routes
*/
const reviewsRouter = require("./reviews");

const router = express.Router();

const {
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTours,
  getTourBasicStats,
  getToursStatsByDifficulty,
  getBusiestMonthInTheGivenYear,
  getToursWithinDistance,
  getTourDistances,
} = require("../controllers/toursController");

//! Nested routes that we give to the reviews router to handle
router.use("/:tourId/reviews", reviewsRouter);

//? Get all tours , post a new tour
router
  .route("/")
  .get(getTours)
  .post(
    authenticationMiddleware,
    restrictToMiddleware("admin", "guide"),
    createTour
  );

//? Get a single tour , update a single tour , delete a single tour
router
  .route("/:id")
  .post(getTour)
  .patch(
    authenticationMiddleware,
    restrictToMiddleware("admin", "guide"),
    updateTour
  )
  .delete(
    authenticationMiddleware,
    restrictToMiddleware("admin", "guide"),
    deleteTour
  );

//? Geo data routes

router
  .route("/tours-within-radius/distance/:distance/center/:latlng/unit/:unit")
  .get(getToursWithinDistance);
router
  .route("/tours-distances/distances/:latlng/unit/:unit")
  .get(getTourDistances);

//? Get top 5 tours by rating
router.route("/top-5-tours").get(aliasGetTopFive, getTours);

//* Tours stats
router.route("/busiest-month/:year").post(getBusiestMonthInTheGivenYear);
router.route("/tours-stats").get(getTourBasicStats);
router.route("/tours-stats-diff").get(getToursStatsByDifficulty);

module.exports = router;
