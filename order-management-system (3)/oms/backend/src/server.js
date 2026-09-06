require("dotenv").config();
const http = require("http");
const createApp = require("./app");
const connectDB = require("./config/db");
const { initSocket } = require("./config/socket");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/oms";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

async function start() {
  await connectDB(MONGO_URI);

  const app = createApp();
  const server = http.createServer(app);

  initSocket(server, CLIENT_ORIGIN);

  server.listen(PORT, () => {
    console.log("server running on port " + PORT);
  });
}

start().catch((err) => {
  console.log("failed to start server", err);
  process.exit(1);
});
