const express = require("express");
const router = express.Router();

const {
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTours,
} = require("../controllers/toursController");


router.route("/").get(getTours).post(createTour);
router.route("/:id").post(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
