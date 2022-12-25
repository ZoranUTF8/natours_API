const dotenv = require("dotenv");
const connectDb = require("./db/connect");
const colors = require("colors/safe");
const Tour = require("./models/Tour");

dotenv.config({ path: "./config.env" });
const app = require("./app");

const PORT = process.env.PORT || 5000;

/*
Connect to db and than start the server if connection is established
*/
const start = async () => {
  try {
    await connectDb(process.env.MONGO_CLOUD_DB_COONECTION)
      .then(
        app.listen(PORT, () =>
          console.log(
            colors.green(
              `Server is listening on port ${PORT}... and connected to db`
            )
          )
        )
      )
      .catch((error) =>
        console.log(colors.red(`Error connecting to mongo atlas`))
      );
  } catch (error) {
    console.log(colors.red(error));
  }
};

start();
