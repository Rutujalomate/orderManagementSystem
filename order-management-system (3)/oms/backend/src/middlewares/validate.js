const ApiError = require("../utils/ApiError");

const validate = (schema, source = "body") => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const details = result.error.issues.map((i) => ({
      field: i.path.join("."),
      message: i.message,
    }));
    return next(new ApiError(400, "Validation failed", details));
  }
  req[source] = result.data;
  next();
};

module.exports = validate;
