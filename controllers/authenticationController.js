const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const catchAsyncError = require("../utils/catchAsyncError");
const { BadRequestError, UnauthenticatedError } = require("../errors");

// Register a new user
const registerUser = catchAsyncError(async (req, res) => {
  //  Add user to the db after

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // Generate and return a jwt token inside the user model as an instance method
  const token = await newUser.generateToken();

  res.status(StatusCodes.CREATED).json({
    status: "success",
    token,
    user: {
      newUser,
    },
  });
});
// Login user
const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  //? Check if email and password is present
  if (!email || !password) {
    next(new BadRequestError("Please check your input."));
  }
  //? Check if user is registered
  const user = await User.findOne({ email });
  //? If no user found with the email than throw error
  if (!user) {
    next(new BadRequestError("You are not registered, please register first."));
  }

  //? Compare user password with the hashed password
  const isPasswordCorrect = await user.comparePassword(password);

  //? If passwords don't match than error message
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError(
      "Invalid credentials. Please check your input."
    );
  }

  //? If the user has the correct password then return the user data with a new jwt token
  const token = await user.generateToken();

  //? If all OK send user a token
  res.status(StatusCodes.OK).json({
    status: "success",
    token,
    data: user,
  });
});

module.exports = {
  registerUser,

  loginUser,
};
