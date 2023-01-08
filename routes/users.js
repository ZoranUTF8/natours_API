const express = require("express");

const router = express.Router();
const {
  getUser,
  updateUser,
  deleteSelfByUser,
  getUsers,
  deleteUserByAdmin,
} = require("../controllers/usersController");

router.route("/").get(getUsers);
router.route("/deleteMe").delete(deleteSelfByUser);
router.route("/:id").post(getUser).patch(updateUser).delete(deleteUserByAdmin);

module.exports = router;
