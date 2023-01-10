const fs = require("fs");
const dotenv = require("dotenv");
const { readFileSync } = require("fs");
const Tour = require("../models/Tour");
const User = require("../models/User");
const Review = require("../models/Review");

const connectDB = require("../db/connect");
dotenv.config({ path: "../config.env" });

// IMPORT DATA INTO DB
async function importData() {
  try {
    //   * Connect to atlas db
    await connectDB(process.env.MONGO_CLOUD_DB_COONECTION);
    // * get json data
    const toursJSON = JSON.parse(
      await readFileSync("./toursWithGeolocation.json", "utf8")
    );
    const usersJSON = JSON.parse(await readFileSync("./users.json", "utf8"));

    const reviewsJSON = JSON.parse(
      await readFileSync("./reviews.json", "utf8")
    );

    // *Delete the previouse database
    // await Tour.deleteMany();
    // await User.deleteMany();
    // await Review.deleteMany();
    // *Populate with new data
    console.log("Start adding data");
    await Tour.create(toursJSON);
    await User.create(usersJSON, { validateBeforeSave: false });
    await Review.create(reviewsJSON);
    console.log("Data added");

    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--some other command arg") {
  //   We can add other function
}

importData();
