module.exports = (func) => {
  return (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch((err) => {
      const statusCode = err.statusCode || 500;
      const message = err.message || "Internal Server Error!";

      res.status(statusCode).json({
        success: false,
        error: message,
      });
    });
  };
};
