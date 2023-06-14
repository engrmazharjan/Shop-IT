const express = require("express");
const app = express();

const errorMiddleware = require("./middlewares/errors");

app.use(express.json());

// * Import All Routes
const products = require("./routes/product");

// * Use All Routes
app.use("/api/v1", products);

// * Middleware To Handle Errors
app.use(errorMiddleware);

module.exports = app;
