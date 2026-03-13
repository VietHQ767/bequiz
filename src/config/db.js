const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/quiz-app";
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    console.error("-> Chạy MongoDB local hoặc dùng MONGO_URI (Atlas) trong file .env");
    throw err;
  }
};

module.exports = connectDB;
