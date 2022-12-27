const { StatusCodes } = require("http-status-codes");
const TourApiFunctions = require("../CustomClasses/TourApiFunctions");
const Tour = require("../models/Tour");


const createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);

    if (tour) {
      res
        .status(StatusCodes.CREATED)
        .json({ status: "Tour created.", data: { tour } });
    }
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: "Tour not created. Value",
      data: { error: err.keyValue },
    });
  }
};
const getTour = async (req, res) => {
  const tour = await Tour.findOne({ _id: req.params.id });
  try {
    if (tour) {
      res.status(StatusCodes.OK).json({ status: "success", data: { tour } });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        status: "failed",
        data: {
          error: `No tour found for the provided id of: ${req.params.id}`,
        },
      });
    }
  } catch (err) {
    res.status(StatusCodes.NOT_FOUND).json({
      status: "failed",
      data: {
        error: `${err}`,
      },
    });
  }
};
const updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findOneAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTour) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: "failed", error: updatedTour });
    }

    res.status(StatusCodes.OK).json({ status: "success", data: updatedTour });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "failed", error: error });
  }
};
const deleteTour = async (req, res) => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);

    if (!deletedTour) {
      console.log("here");
      res.status(StatusCodes.NOT_FOUND).json({
        status: "failed",
        error: `No tour found for provided id of ${req.params.id}`,
      });
    } else {
      res.status(StatusCodes.OK).json({ status: "success", data: deletedTour });
    }
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "failed", error: error });
  }
};
const getTours = async (req, res) => {
  // const excludedFields = ["page", "sort", "limit", "fields"];
  // excludedFields.forEach((el) => delete queryObject[el]);

  try {
    const ApiFunctions = new TourApiFunctions(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await ApiFunctions.query;

    if (tours) {
      res
        .status(StatusCodes.OK)
        .json({ status: "success", items: tours.length, data: { tours } });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        status: "failed",
        data: {
          error: `No tours found.`,
        },
      });
    }
  } catch (err) {
    res.status(StatusCodes.NOT_FOUND).json({
      status: "failed",
      data: {
        error: `${err}`,
      },
    });
  }
};

//! Tours stats for charts
const getTourBasicStats = async (req, res) => {
  try {
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

    res
      .status(StatusCodes.OK)
      .json({ status: "success", data: { toursStats } });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "fail", message: error });
  }
};

const getToursStatsByDifficulty = async (req, res) => {
  try {
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

    res
      .status(StatusCodes.OK)
      .json({ status: "success", data: { toursStats } });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "fail", message: error });
  }
};

//* Calculate the busiest month in the given year
const getBusiestMonthInTheGivenYear = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ status: "fail" });
  }
};

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
