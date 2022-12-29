const express = require("express");

const router = express.Router();

const {
  registerUser,
  getUser,
  updateUser,
  deleteUser,
  getUsers,
} = require("../controllers/authenticationController");

router.route("/").get(getUsers).post(registerUser);
router.route("/:id").post(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
