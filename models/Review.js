const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema(
  {
    reviewText: {
      type: String,
      required: [true, "Please provide the review."],
    },
    rating: {
      type: Number,
      required: [true, "Please provide the review rating."],
      min: 1,
      max: 5,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Please provide the tour for the review ."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Please provide the owner of the review."],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
//! Virtual property which is not persisted in the db, but only present once we get the data

//! Query middleware
//? Populate the guides in the tours
ReviewSchema.pre(/^find/, function () {
  // this.populate({
  //   path: "tour",
  //   select: "name",
  // }).populate({
  //   path: "user",
  //   select: "name avatar",
  // });
  this.populate({ path: "user", select: "name avatar" });
});

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
