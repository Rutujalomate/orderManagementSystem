const mongoose = require("mongoose");

async function connectDB(uri) {
  await mongoose.connect(uri);
  console.log("mongo connected:", mongoose.connection.name);

  mongoose.connection.on("error", (err) => {
    console.log("mongo error", err);
  });
}

module.exports = connectDB;
