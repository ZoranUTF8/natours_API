const { StatusCodes } = require("http-status-codes");

const createTour = (req, res) => {
  console.log("create tour");

  res.status(StatusCodes.OK).json({ status: "created a tour", data: {} });
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
  console.log(req.requestTime);
  res.status(200).json({ status: "get all tours", data: {} });
};

module.exports = {
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTours,
};
