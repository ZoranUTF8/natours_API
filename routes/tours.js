const express = require("express");
const router = express.Router();

const {
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTours,
} = require("../controllers/toursController");

router.param("id", (req, res, next, val) => {
  console.log("im here", val);
  next();
});
router.route("/").get(getTours).post(createTour);
router.route("/:id").post(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
