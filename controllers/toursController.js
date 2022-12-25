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
const getTour = (req, res) => {
  const { id } = req.params;
  console.log("get single tour");
  res.status(200).json({ status: "get a single tour", data: { id } });
};
const updateTour = (req, res) => {
  const { id } = req.params;

  res.status(200).json({ status: "update tour", data: { id } });
};
const deleteTour = (req, res) => {
  const { id } = req.params;

  res.status(200).json({ status: "delete tour", data: { id } });
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
