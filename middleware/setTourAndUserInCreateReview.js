const setTourAndUserIDsForCreateReview = (req, res, next) => {
  //? Get the specific tour id from the params
  if (!req.body.tour) req.body.tour = req.params.tourId;
  //? Get the specific user id from the req.user
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

module.exports = setTourAndUserIDsForCreateReview;
