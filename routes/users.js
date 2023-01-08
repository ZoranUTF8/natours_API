const express = require("express");

const router = express.Router();
const {
  getUser,
  updateUser,
  deleteSelfByUser,
  getUsers,
  deleteUserByAdmin,
} = require("../controllers/usersController");
const getMeMiddleware = require("../middleware/getMeMiddleware");
const restrictToMiddleware = require("../middleware/restrictToMiddleware");

router.route("/me").get(getMeMiddleware, getUser);
router.route("/deleteMe").delete(deleteSelfByUser);
router
  .route("/:id")
  .post(restrictToMiddleware("admin"), getUser)
  .patch(updateUser)
  .delete(restrictToMiddleware("admin"), deleteUserByAdmin);
router.route("/").get(restrictToMiddleware("admin"), getUsers);

module.exports = router;
