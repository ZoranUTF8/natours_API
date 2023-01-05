const express = require("express");
const restrictToMiddleware = require("../middleware/restrictToMiddleware");

const router = express.Router({ mergeParams: true });

const {
  getReviews,
  createReview,
  deleteReview,
  updateReview,
} = require("../controllers/reviewsController");

router
  .route("/")
  .get(getReviews)
  .post(restrictToMiddleware("user"), createReview)
  .delete(deleteReview)
  .patch(updateReview);

module.exports = router;
