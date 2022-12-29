const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const catchAsyncError = require("../utils/catchAsyncError");

// Register a new user
const registerUser = catchAsyncError(async (req, res) => {
  console.log("register user");
  const user = await User.create(req.body);

  res.status(StatusCodes.OK).json({ status: "created a user", data: { user } });
});

const getUser = (req, res) => {
  const { id } = req.params;
  console.log("get user info");
  res.status(200).json({ status: "get a single user info", data: { id } });
};
const updateUser = (req, res) => {
  const { id } = req.params;

  res.status(200).json({ status: "update user", data: { id } });
};
const deleteUser = (req, res) => {
  const { id } = req.params;

  res.status(200).json({ status: "delete user", data: { id } });
};

const getUsers = (req, res) => {
  console.log("get all users");
  res.status(200).json({ status: "get all users", data: {} });
};

module.exports = {
  registerUser,
  getUser,
  updateUser,
  deleteUser,
  getUsers,
};
