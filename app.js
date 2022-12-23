const express = require("express");

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log("this is middleware");
  next();
});

const getTours = (req, res) => {
  console.log("get all tours");

  res.status(200).json({ status: "get all tours", data: {} });
};
const createTour = (req, res) => {
  console.log("create tour");

  res.status(200).json({ status: "created a tour", data: {} });
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

app.route("/api/v1/tours").get(getTours).post(createTour);
app
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// Create a tour
app;
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server on ${PORT}`);
});
