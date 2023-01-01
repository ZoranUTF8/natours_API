const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authenticationController");

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").patch(resetPassword);
module.exports = router;
