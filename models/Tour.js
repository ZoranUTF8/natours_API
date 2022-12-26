const mongoose = require("mongoose");

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
    },
    price: {
      type: Number,
      required: [true, "Please provide the tour price"],
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
  { timestamps: true }
);

module.exports = mongoose.model("Tour", TourSchema);
