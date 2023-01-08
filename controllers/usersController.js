const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const catchAsyncError = require("../utils/catchAsyncError");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
const { deleteOne, updateOne, getOne } = require("./handlerFactory");

//? Set user inactive if he wants to delete himself
const deleteSelfByUser = catchAsyncError(async (req, res, next) => {
  //? Set users active status to false later add delete

  const user = await User.findByIdAndUpdate(req.user.id, { active: false });

  if (!user) {
    return next(
      new NotFoundError(
        `No user found with ${req.params.id}, check your input.`
      )
    );
  }

  res.status(StatusCodes.OK).json({ status: "success", data: user });
});
//? Delete user by admin
const deleteUserByAdmin = deleteOne(User);

const getUser = getOne(User);

const updateUser = updateOne(User);

const getUsers = catchAsyncError(async (req, res) => {
  const allUsers = await User.find();

  res.status(200).json({ status: "success", data: { users: allUsers } });
});

module.exports = {
  getUser,
  updateUser,
  deleteSelfByUser,
  getUsers,
  deleteUserByAdmin,
};
