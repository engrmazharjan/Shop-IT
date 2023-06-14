const express = require("express");
const app = express();

app.use(express.json());

// * Import All Routes
const products = require("./routes/product");

// * Use All Routes
app.use("/api/v1", products);

module.exports = app;
