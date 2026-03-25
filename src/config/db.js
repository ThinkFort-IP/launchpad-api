const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }

  const dbName = process.env.MONGODB_NAME || "Launchpad";
  mongoose.set("strictQuery", true);
  await mongoose.connect(process.env.MONGODB_URI, { dbName });
  console.log("MongoDB connected");
};

module.exports = connectDB;
