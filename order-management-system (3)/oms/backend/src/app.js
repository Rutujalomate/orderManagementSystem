const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const routes = require("./routes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));
  app.use(express.json());
  app.use(morgan("dev"));

  app.use("/api", routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
