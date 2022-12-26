const express = require("express");

const router = express.Router();

const {
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTours,
  aliasGetTopFive,
} = require("../controllers/toursController");

router.route("/").get(getTours).post(createTour);
router.route("/:id").post(getTour).patch(updateTour).delete(deleteTour);
router.route("/top-5-tours").get(aliasGetTopFive, getTours);

module.exports = router;
