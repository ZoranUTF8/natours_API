const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
    password: {
      type: String,
      required: [true, "Please provide a password."],
      minLength: 8,
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
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  //   has the password and delete the confirmed
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
const User = mongoose.model("User", UserSchema);

module.exports = User;
