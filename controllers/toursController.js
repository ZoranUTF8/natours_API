const { StatusCodes } = require("http-status-codes");
const BadRequestError = require("../errors/BadRequestError");
const Tour = require("../models/Tour");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");

const catchAsyncError = require("../utils/catchAsyncError");

const createTour = createOne(Tour);

const getTour = getOne(Tour, { path: "reviews" }, { queryFilter: "SLUG" });

const updateTour = updateOne(Tour);

const deleteTour = deleteOne(Tour);

const getTours = getAll(Tour);

//? Tours stats for charts
const getTourBasicStats = catchAsyncError(async (req, res) => {
  const toursStats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 0 } },
    },
    {
      $group: {
        _id: null,
        totalTours: { $sum: 1 },
        totalRatings: { $sum: "$ratingQuantity" },
        avgRating: { $avg: "$ratingAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: {
        minPrice: 1,
      },
    },
  ]);

  res.status(StatusCodes.OK).json({ status: "success", data: { toursStats } });
});

const getToursStatsByDifficulty = catchAsyncError(async (req, res) => {
  const toursStats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 0 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        totalTours: { $sum: 1 },
        totalRatings: { $sum: "$ratingQuantity" },
        avgRating: { $avg: "$ratingAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: {
        minPrice: 1,
      },
    },
  ]);

  res.status(StatusCodes.OK).json({ status: "success", data: { toursStats } });
});

//* Calculate the busiest month in the given year
const getBusiestMonthInTheGivenYear = catchAsyncError(async (req, res) => {
  const year = +req.params.year;

  const tourPlan = await Tour.aggregate([
    { $unwind: "$startDates" },
    {
      $match: {
        // match all the tours with the date for the year
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStart: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      // add fields month with the value of the id
      $addFields: { month: "$_id" },
    },
    {
      // Decide what so show and what not here we dont show the id
      $project: {
        _id: 0,
      },
    },
    {
      // sort by descending
      $sort: { numTourStart: -1 },
    },
  ]);

  res
    .status(StatusCodes.OK)
    .json({ status: "success", count: tourPlan.length, data: { tourPlan } });
});

//* Get tours by radius
// /tours-within-distance/:distance/center/:latlng/:unit
// /tours-within-distance/250/center/-30,45/km
const getToursWithinDistance = catchAsyncError(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  //? Radius of the sphere in radiants
  //? Dividing the distance by the radius of the earth
  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!distance || !latlng || !unit) {
    next(new BadRequestError("Invalid request."));
  }

  //? GeoWithin finds documents inside the provided geometry
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res
    .status(StatusCodes.OK)
    .json({ status: "success", results: tours.length, data: { tours } });
});

//? Get tour distances
const getTourDistances = catchAsyncError(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  if (!latlng || !unit) {
    next(new BadRequestError("Invalid request."));
  }

  const multiplier = unit === "mi" ? 0.000621371 : 0.001;

  //? GeoWithin finds documents inside the provided geometry
  const tourDistances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: "distance",
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(StatusCodes.OK).json({
    status: "success",
    results: tourDistances.length,
    data: { tourDistances },
  });
});
module.exports = {
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTours,
  getTourBasicStats,
  getToursStatsByDifficulty,
  getBusiestMonthInTheGivenYear,
  getToursWithinDistance,
  getTourDistances,
};
