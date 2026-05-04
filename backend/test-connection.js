const mongoose = require("mongoose");
require("dotenv").config();

const connectionString = process.env.MONGODB_URI;

console.log("Testing connection to MongoDB Atlas...");
console.log(
  "Connection string:",
  connectionString.replace(/Paragon2025/, "******"),
);

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("✅ Successfully connected to MongoDB!");
    console.log("Database:", mongoose.connection.name);
    return mongoose.disconnect();
  })
  .then(() => {
    console.log("✅ Disconnected");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Connection failed!");
    console.error("Error:", err.message);
    process.exit(1);
  });
