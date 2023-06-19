const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/errors");

app.use(express.json());
app.use(cookieParser());

// * Import All Routes
const products = require("./routes/product");
const auth = require("./routes/auth");
const orders = require("./routes/order");

// * Use All Routes
app.use("/api/v1", products);
app.use("/api/v1", auth);
app.use("/api/v1", orders);

// * Middleware To Handle Errors
app.use(errorMiddleware);

module.exports = app;
