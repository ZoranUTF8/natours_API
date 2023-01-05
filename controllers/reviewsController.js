const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const Review = require("../models/Review");
const catchAsyncError = require("../utils/catchAsyncError");

// ? This route handled both get all reviews or specific single tour reviws
const getReviews = catchAsyncError(async (req, res, next) => {
  let searchFilter = {};
  //? Get the specific tour id from the params
  if (req.params.tourId) searchFilter = { tour: req.params.tourId };

  const reviews = await Review.find(searchFilter);

  if (reviews.length === 0) {
    return next(new NotFoundError("No reviews found"));
  }
  res.status(StatusCodes.OK).json({ status: "success", data: { reviews } });
});

const createReview = catchAsyncError(async (req, res, next) => {
  //? Get the specific tour id from the params
  if (!req.body.tour) req.body.tour = req.params.tourId;
  //? Get the specific user id from the req.user
  if (!req.body.user) req.body.user = req.user.id;

  const { reviewText, rating } = req.body;

  if (!rating || !reviewText) {
    return next(new BadRequestError("Please check your input."));
  }
  const newReview = await Review.create(req.body);

  res.status(StatusCodes.OK).json({ status: "success", data: newReview });
});

const deleteReview = catchAsyncError(async (req, res, next) => {
  res.status(StatusCodes.OK).json({ status: "success" });
});

const updateReview = catchAsyncError(async (req, res, next) => {
  res.status(StatusCodes.OK).json({ status: "success" });
});

module.exports = { getReviews, createReview, deleteReview, updateReview };
