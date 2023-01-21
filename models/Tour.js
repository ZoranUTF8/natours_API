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
      // Set to round the average field
      set: (val) => Math.round(val * 10) / 10,
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
    startLocation: {
      //? GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    //? Reference to a guides object
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    images: [String],
    startDates: [Date],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);


//! Creating custom indexes only on most querried data
//* If collection is only written to but not querried no benefit adding indexes
TourSchema.index({ price: 1, ratingAverage: -1 }); //* Compound index that gets the price ascending and average descending
TourSchema.index({ slug: 1 }); //* Slug
TourSchema.index({ startLocation: "2dsphere" }); //* For geo spatial data

//! Virtual property which is not persisted in the db, but only present once we get the data
TourSchema.virtual("durationInWeeks").get(function () {
  return this.duration / 7;
});

//! Virtual populate when we get one single tour so we can show it's reviews
//* Allows us to get the reviews for a specific tour but without actually persisting it on our db  as there can be millions of reviews which than would have to be saved in an reviews array
TourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

//! Mongoose middleware runs on save() and create()
TourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//! If we want to embed the guides data into our tours we use this
// TourSchema.pre("save", async function (next) {
//   //? Get the guides information and embed them to the tour
//   const tourGuidesPromises = this.guides.map(
//     async (guideId) => await User.findById(guideId)
//   );
//   //? Once all promises fullfil add the data from them to the guides array for the specific tour
//   this.guides = await Promise.all(tourGuidesPromises);
//   next();
// });

//! Query middleware

//?that will return us all the documents that are not active
// TourSchema.pre("find", function (next) {
//   this.find({ activeTour: { $eq: false } });
//   next();
// });
//? Populate the guides in the tours
TourSchema.pre(/^find/, function () {
  this.populate({
    path: "guides",
    select: "-__v -updatedAt",
  });
});

const Tour = mongoose.model("Tour", TourSchema);

module.exports = Tour;
