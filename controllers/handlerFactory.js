const { StatusCodes } = require("http-status-codes");
const catchAsyncError = require("../utils/catchAsyncError");
const { NotFoundError } = require("../errors");
const TourApiFunctions = require("../CustomClasses/TourApiFunctions");

//? Universal fu ction for deleting one document

const deleteOne = (Model) =>
  catchAsyncError(async (req, res, next) => {
    const deletedDoc = await Model.findByIdAndDelete(req.params.id);

    if (!deletedDoc) {
      return next(
        new NotFoundError(
          `No document found with ${req.params.id}, check your input.`
        )
      );
    }

    res.status(StatusCodes.OK).json({ status: "success", data: deletedDoc });
  });

//! Do not update passwords with this function
const updateOne = (Model) =>
  catchAsyncError(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoc) {
      return next(
        new NotFoundError(
          `No document found with ${req.params.id}, check your input.`
        )
      );
    }

    res.status(StatusCodes.OK).json({ status: "success", data: updatedDoc });
  });

const createOne = (Model) =>
  catchAsyncError(async (req, res, next) => {
    const createdDoc = await Model.create(req.body);

    res
      .status(StatusCodes.CREATED)
      .json({ status: "Document created.", data: { createdDoc } });
  });

const getOne = (Model, PopulateOption) =>
  catchAsyncError(async (req, res, next) => {
    const query = Model.findById(req.params.id);

    if (PopulateOption) query.populate(PopulateOption);

    const foundDoc = await query;

    res
      .status(StatusCodes.OK)
      .json({ status: "Document found.", data: { foundDoc } });
  });

const getAll = (Model) =>
  catchAsyncError(async (req, res) => {
    //? Get the specific tour id from the params for the nested tour reviews route
    let searchFilter = {};
    if (req.params.tourId) searchFilter = { tour: req.params.tourId };

    const ApiFunctions = new TourApiFunctions(
      Model.find(searchFilter),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await ApiFunctions.query;
    res
      .status(StatusCodes.OK)
      .json({ status: "success", items: docs.length, data: { docs } });
  });

module.exports = { deleteOne, updateOne, createOne, getOne, getAll };
