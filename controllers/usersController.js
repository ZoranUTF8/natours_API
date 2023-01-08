const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const catchAsyncError = require("../utils/catchAsyncError");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
const { deleteOne, updateOne, getOne, getAll } = require("./handlerFactory");

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

const getUsers = getAll(User);

module.exports = {
  getUser,
  updateUser,
  deleteSelfByUser,
  getUsers,
  deleteUserByAdmin,
};
