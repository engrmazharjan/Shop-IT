const app = require("./app");
const connectDatabase = require("./config/database");
const dotenv = require("dotenv");

// * Handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log(`Shutting Down The Server Due To Uncaught Exception`);
  process.exit(1);
});

// * Setting up config file
dotenv.config({ path: "backend/config/config.env" });

// * Conneting To Database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server Listening on PORT:${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});

// * Handle Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log(`Shutting Down The Server Due To Unhandled Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});
