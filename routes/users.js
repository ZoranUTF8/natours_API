const express = require("express");

const router = express.Router();
const {
  getUser,
  updateUser,
  deleteUser,
  getUsers,
} = require("../controllers/usersController");

router.route("/").get(getUsers);
router.route("/:id").post(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
