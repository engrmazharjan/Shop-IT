const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  // if (process.env.NODE_ENV === "DEVELOPMENT") {return
  res.status(err.statusCode).json({
    success: false,
    error: err,
    errMessage: err.message,
    stack: err.stack, // Include the error stack trace
  });
  // }

  // if (process.env.NODE_ENV === "PRODUCTION") {
  let error = { ...err };

  error.message = err.message || "Internal Server Error!";

  // Wrong Mongoose Object ID Error
  if (err.name === "CastError") {
    const message = `Resource Not Found. Invalid: ${err.path}`;
    error = new ErrorHandler(message, 400);
  }

  // Handling Mongoose Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((value) => value.message);
    error = new ErrorHandler(message, 400);
  }

  // Handling Mongoose Duplicate Key Errors
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    error = new ErrorHandler(message, 400);
  }

  // Handling Wrong JWT Error
  if (err.name === "JsonWebTokenError") {
    const message = "JSON Web Token Is Invalid. Try Again!!!";
    error = new ErrorHandler(message, 400);
  }

  // Handling Expired JWT Error
  if (err.name === "TokenExpiredError") {
    const message = "JSON Web Token Is Expired. Try Again!!!";
    error = new ErrorHandler(message, 400);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message, // Use the modified error message
  });
  // }
};
