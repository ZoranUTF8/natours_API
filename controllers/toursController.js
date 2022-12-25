const { StatusCodes } = require("http-status-codes");
const Tour = require("../models/Tour");

const createTour = async (req, res) => {
  try {
    const creatingTourResult = await Tour.create(req.body);

    if (creatingTourResult) {
      res
        .status(StatusCodes.CREATED)
        .json({ status: "Tour created.", data: { creatingTourResult } });
    }
  } catch (err) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "Tour not created.", data: { error: err } });
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

const getTours = (req, res) => {
  console.log("get all tours");
  res.status(200).json({ status: "get all tours", data: {} });
};

module.exports = {
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTours,
};
