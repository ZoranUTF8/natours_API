const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const catchAsyncError = require("../utils/catchAsyncError");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");

const deleteUser = catchAsyncError(async (req, res, next) => {
  //? Set users active status to false later add delete
  const userId = req.params.id;

  const user = await User.findByIdAndUpdate(userId, { active: false });

  if (!user) {
    return next(
      new NotFoundError(
        `No user found with ${req.params.id}, check your input.`
      )
    );
  }

  res.status(StatusCodes.OK).json({ status: "success", data: user });
});
const getUser = catchAsyncError(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });

  if (!user) {
    return next(
      new NotFoundError(
        `No user found with ${req.params.id}, check your input.`
      )
    );
  }

  res.status(StatusCodes.OK).json({ status: "success", data: { user } });
});
const updateUser = catchAsyncError(async (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.params.id;

  const updatedUser = await User.findOneAndUpdate(
    userId,
    { name, email },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedUser) {
    return next(
      new NotFoundError(
        `No user found with ${req.params.id}, check your input.`
      )
    );
  }

  res.status(StatusCodes.OK).json({ status: "success", data: updatedUser });
});

const getUsers = catchAsyncError(async (req, res) => {
  const allUsers = await User.find();

  res.status(200).json({ status: "success", data: { users: allUsers } });
});

module.exports = { getUser, updateUser, deleteUser, getUsers };
