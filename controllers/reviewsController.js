const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");
const Review = require("../models/Review");
// const catchAsyncError = require("../utils/catchAsyncError");

const getReviews = getAll(Review);

const createReview = createOne(Review);

const deleteReview = deleteOne(Review);

const updateReview = updateOne(Review);

const getSingleReview = getOne(Review);

module.exports = {
  getReviews,
  createReview,
  deleteReview,
  updateReview,
  getSingleReview,
};
