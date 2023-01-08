const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const User = require("../models/User");
const catchAsyncError = require("../utils/catchAsyncError");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const sendEmail = require("../utils/SendPasswordResetEmail");

//? Cookie for the JWT
//* JWT schould be stored in a secure only http cookie
const createCookieForJWTAndSendResponse = async (res, user) => {
  const expiryDate = new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  );

  const cookieOptions = {
    expires: expiryDate,
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  //? If the user has the correct password then return the user data with a new jwt token
  const token = await user.generateToken();
  res.cookie("JWT_STORAGE", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  return res.status(StatusCodes.OK).json({
    status: "success",
    token,
    data: user,
  });
};
//? Register a new user
const registerUser = catchAsyncError(async (req, res) => {
  const newUser = await User.create(req.body);

  //? If all OK send user a token
  createCookieForJWTAndSendResponse(res, newUser);
});
//? Login user
const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  //? Check if email and password is present
  if (!email || !password) {
    next(new BadRequestError("Please check your input."));
  }
  //? Check if user is registered
  const user = await User.findOne({ email }).select("+password");
  //? If no user found with the email than throw error
  if (!user) {
    next(new BadRequestError("You are not registered, please register first."));
  }
  //? Compare user password with the hashed password
  const isPasswordCorrect = await user.comparePassword(password, user.password);

  //? If passwords don't match than error message
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError(
      "Invalid credentials. Please check your input."
    );
  }
  //? If all OK send user a token
  createCookieForJWTAndSendResponse(res, user);
});

//? Send user password reset email
const forgotPassword = catchAsyncError(async (req, res, next) => {
  //? Get the user for the provide email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    next(
      new BadRequestError(
        `No user registered with the provided email address: ${req.body.email}`
      )
    );
  }
  //? Generate random reset token
  const resetToken = user.createForgotPasswordToken();
  //? Save the user with the new reset token to the db
  await user.save({ validateBeforeSave: false });

  //? Send to user email
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetPassword/${resetToken}}`;

  const message = `Forgot password ? Submit a request to the  ${resetPasswordUrl} with your new password.\nIf you didn't forget your password, please ignore this email.`;

  try {
    await sendEmail({
      email: req.body.email,
      subject: "Your reset token is valid for 10 minutes.",
      message,
    });

    res.status(StatusCodes.OK).json({
      status: "success",
      message:
        "Token sent to the provided email address.Please check your email address.",
    });
  } catch (err) {
    //? Reset the user token
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    //? Save the user with the new reset token to the db
    await user.save({ validateBeforeSave: false });

    return next(new BadRequestError("Error sending the reset email."));
  }
});

//? Handle the reset password request
const resetPassword = catchAsyncError(async (req, res, next) => {
  //? Get user from the provided token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });
  //? If token has not expired and the user is true than set it's new password
  if (!user) {
    next(new BadRequestError("Token has expired. Please request a new one."));
  }

  //? Update the password changed at for the updated user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;

  await user.save();
  //? Log in the user with the new JWT token

  //? If all OK send user a token
  createCookieForJWTAndSendResponse(res, user);
});

// Update user password
const updateUserPassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  // Get user current password and check with the logged in users password
  const user = await User.findById({ _id: req.user.id }).select("+password");

  //? Compare user password with the hashed password
  const isPasswordCorrect = await user.comparePassword(
    oldPassword,
    user.password
  );

  // If correct than update and send with new jwt
  if (isPasswordCorrect) {
    //? Update the password changed at for the updated user
    user.password = newPassword;
    user.passwordConfirm = confirmNewPassword;

    await user.save();

    //? If all OK send user a token
    createCookieForJWTAndSendResponse(res, user);
  } else {
    next(new UnauthenticatedError("Incorrect password."));
  }
});



module.exports = {
  registerUser,
  forgotPassword,
  resetPassword,
  loginUser,
  updateUserPassword,
};
