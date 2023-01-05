const fs = require("fs");
const dotenv = require("dotenv");
const { readFileSync } = require("fs");
const Tour = require("../models/Tour");
const connectDB = require("../db/connect");
dotenv.config({ path: "../config.env" });

// IMPORT DATA INTO DB
async function importData() {
  try {
    //   * Connect to atlas db
    await connectDB(process.env.MONGO_CLOUD_DB_COONECTION);
    // * get json data
    const jsonData = JSON.parse(
      await readFileSync("./toursWithGeolocation.json", "utf8")
    );
    // *Delete the previouse database
    await Tour.deleteMany();
    // *Populate with new datga
    await Tour.create(jsonData);
    console.log("Data addded");
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

// importData();
