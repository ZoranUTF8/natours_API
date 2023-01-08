const express = require("express");
const restrictToMiddleware = require("../middleware/restrictToMiddleware");

const router = express.Router({ mergeParams: true });

const {
  getReviews,
  createReview,
  deleteReview,
  updateReview,
  getSingleReview,
} = require("../controllers/reviewsController");
const setTourAndUserIDsForCreateReview = require("../middleware/setTourAndUserInCreateReview");

router
  .route("/")
  .get(getReviews)
  .post(
    restrictToMiddleware("user"),
    setTourAndUserIDsForCreateReview,
    createReview
  );

router
  .route("/:id")
  .patch(restrictToMiddleware("admin", "user"), updateReview)
  .delete(restrictToMiddleware("admin", "user"), deleteReview)
  .get(getSingleReview);

module.exports = router;
