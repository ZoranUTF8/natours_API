const aliasGetTopFive = (req, res, next) => {
  //* We prefil the query filters so we get the top 5
  req.query.limit = "6";
  req.query.sort = "-ratingAverage,price";
  req.query.fields =
    "name,price,ratingAverage,duration,summary,description,imageCover,difficulty,slug";
  next();
};

module.exports = aliasGetTopFive;
