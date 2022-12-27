const mongoose = require("mongoose");
const slugify = require("slugify");

const TourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the tour name"],
      unique: true,
    },
    duration: {
      type: Number,
      required: [true, "A tour mush have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour mush have a maximum group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty can be: easy, medium or difficult",
      },
    },
    price: {
      type: Number,
      required: [true, "Please provide the tour price"],
    },
    slug: {
      type: String,
    },
    ratingAverage: {
      type: Number,
      default: 0.0,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
    },
    activeTour: {
      type: Boolean,
      default: false,
    },
    summary: {
      type: String,
      trime: true,
      required: [true, "A your must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    startDates: [Date],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//! Virtual property which is not persisted in the db, but only present once we get the data
TourSchema.virtual("durationInWeeks").get(function () {
  return this.duration / 7;
});

//! Mongoose midleware runs on save() and create()
TourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//! Query middleware that will return us all the documents that are not active
// ! Maybe add later
// TourSchema.pre("find", function (next) {
//   this.find({ activeTour: { $eq: false } });
//   next();
// });

const Tour = mongoose.model("Tour", TourSchema);

module.exports = Tour;
