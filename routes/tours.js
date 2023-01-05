const express = require("express");
const aliasGetTopFive = require("../middleware/top-five-tours");
const restrictToMiddleware = require("../middleware/restrictToMiddleware");
//! Router nested
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
} = require("../controllers/toursController");

//! Nested routes
router.use("/:tourId/reviews", reviewsRouter);

router.route("/").get(getTours).post(createTour);

router
  .route("/:id")
  .post(getTour)
  .patch(updateTour)
  .delete(restrictToMiddleware("admin"), deleteTour);
router.route("/top-5-tours").get(aliasGetTopFive, getTours);

//* Tours stats

router.route("/busiest-month/:year").post(getBusiestMonthInTheGivenYear);
router.route("/tours-stats").get(getTourBasicStats);
router.route("/tours-stats-diff").get(getToursStatsByDifficulty);

module.exports = router;
