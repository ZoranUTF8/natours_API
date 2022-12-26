const { StatusCodes } = require("http-status-codes");
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
  const queryObject = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObject[el]);
  
  let queryStr = JSON.stringify(queryObject);
  //* Replace the query string with the apropriate mongodb operators
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  //! returns a query object
  const userQuery = Tour.find(JSON.parse(queryStr));

  const tours = await userQuery;
  try {
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

module.exports = {
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTours,
};
