const { StatusCodes } = require("http-status-codes");
const TourApiFunctions = require("../CustomClasses/TourApiFunctions");
const NotFoundError = require("../errors/NotFoundError");
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

const getTour = getOne(Tour, { path: "reviews" });

const updateTour = updateOne(Tour);

const deleteTour = deleteOne(Tour);

const getTours = getAll(Tour);

//! Tours stats for charts
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

module.exports = {
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTours,
  getTourBasicStats,
  getToursStatsByDifficulty,
  getBusiestMonthInTheGivenYear,
};
