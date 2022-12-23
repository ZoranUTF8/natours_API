const express = require("express");
const router = express.Router();

const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getUsers,
} = require("../controllers/usersController");

router.route("/").get(getUsers).post(createUser);
router.route("/:id").post(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
