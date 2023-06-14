const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

// * Setting up config file
dotenv.config({ path: "backend/config/config.env" });

// * Conneting To Database
connectDatabase();

app.listen(process.env.PORT, () => {
  console.log(
    `Server Listening on PORT:${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});
