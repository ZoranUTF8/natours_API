const dotenv = require("dotenv");
const connectDb = require("./db/connect");

dotenv.config({ path: "./config.env" });
const app = require("./app");

const PORT = process.env.PORT || 5000;

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});
/*
Connect to db and than start the server if connection is established
*/
connectDb(process.env.MONGO_CLOUD_DB_COONECTION).then(() =>
  console.log("DB connection successful!")
);

const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});

//? Handling unhandling rejected promises
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION!💥  Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
