const mongoose = require("mongoose");

const TourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the tour name"],
      unique: true,
    },
    rating: {
      type: Number,
      default: 0.0,
    },
    price: {
      type: Number,
      required: [true, "Please provide the tour price"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tour", TourSchema);
