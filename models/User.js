const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the user name."],
      minLength: 3,
      maxLength: 30,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please provide user email."],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address."],
    },
    role: {
      type: String,
      enum: ["user", "guide", "lead-guide", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please provide a password."],
      minLength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Passwords must match."],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
      },
      message: "Passwords must be the same.",
    },
    avatar: {
      type: String,
    },
    passwordChangedAt: Date,
  },
  { timestamps: true }
);

//! Hash user password on register
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  //   has the password and delete the confirmed
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  return next();
});

// Schema instance methods
//! Generate a JWT for the user
// Generate a new JWT token when the user registers
UserSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id, name: this.name }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

// Check if users password match

UserSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//  Check if password was changed since token was issued
UserSchema.methods.changedPassword = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    // if timestamp is less than than the password changed
    return JWTTimestamp < changedTimestamp;
  }
  // False means password was not changed
  return false;
};
const User = mongoose.model("User", UserSchema);

module.exports = User;
