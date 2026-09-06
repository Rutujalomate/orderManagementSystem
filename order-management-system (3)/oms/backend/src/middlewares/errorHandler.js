const ApiError = require("../utils/ApiError");

function notFound(req, res, next) {
  next(new ApiError(404, "not found: " + req.method + " " + req.originalUrl));
}

function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "something went wrong";

  if (err.name === "CastError") {
    statusCode = 400;
    message = "invalid id";
  }

  console.error(err);

  res.status(statusCode).json({
    success: false,
    message,
    ...(err.details ? { details: err.details } : {}),
  });
}

module.exports = { notFound, errorHandler };
