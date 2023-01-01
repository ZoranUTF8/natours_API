const express = require("express");
const authenticationMiddleware = require("../middleware/authentication");

const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updateUserPassword,
} = require("../controllers/authenticationController");

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").patch(resetPassword);
router
  .route("/updatePassword")
  .post(authenticationMiddleware, updateUserPassword);

module.exports = router;
