const mongoose = require("mongoose");
const Tour = require("./Tour");

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

//? One user comment per tour
ReviewSchema.index({ tour: 1, user: 1 }, { unique: true });

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

//? Schema static method that we call on the model

//? Calculate average tour ratings
ReviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        numberOfRatings: { $sum: 1 },
        totalAverageOfRating: { $avg: "$rating" },
      },
    },
  ]);
  //? Add the new rating stats to the specific tour

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingQuantity: stats[0].numberOfRatings,
      ratingAverage: stats[0].totalAverageOfRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};
//? Schema instance methods that we call on the model instance

// * Post has no access to next
//* Update the statistics when we delete or update a reviews
ReviewSchema.post("save", function () {
  //? This point to current review
  this.constructor.calcAverageRatings(this.tour);
});

ReviewSchema.pre(/^findOneAnd/, async function (next) {
  //? Get acces to the current document
  this.r = await this.clone().findOne();
  next();
});

ReviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
